<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\Participant;
use App\Models\Message;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    // 1. Mostrar la bandeja de entrada (Lista de conversaciones + contador no_leidos)
    public function misConversaciones(Request $request)
    {
        $user = $request->user();

        $conversaciones = Conversation::whereHas('participantes', function ($query) use ($user) {
            $query->where('usuarioid', $user->usuarioid);
        })->with([
            'participantes.usuario' => function ($q) {
                $q->select(['usuarioid', 'nom_us', 'foto']);
            },
            'mensajes' => function ($q) {
                $q->latest('mensajeid')->limit(1);
            }
        ])->orderByDesc('conversacionid')->get();

        foreach ($conversaciones as $conv) {
            $miParticipante = $conv->participantes->firstWhere('usuarioid', $user->usuarioid);

            $queryNoLeidos = Message::where('conversacionid', $conv->conversacionid)
                ->where(function ($q) use ($miParticipante) {
                    $q->whereNull('participanteid');
                    if ($miParticipante) {
                        $q->orWhere('participanteid', '!=', $miParticipante->participanteid);
                    }
                });

            if ($miParticipante && !empty($miParticipante->ultim_lectura)) {
                $queryNoLeidos->where('fech_envio', '>', $miParticipante->ultim_lectura);
            }

            $conv->setAttribute('no_leidos', (int) $queryNoLeidos->count());
        }

        return response()->json([
            'conversaciones' => $conversaciones
        ], 200);
    }

    // 2. Ver los mensajes de una conversación específica por lotes (limit + before_id) y marcar leído
    public function verMensajes(Request $request, $conversacionid)
    {
        $user = $request->user();

        $participante = Participant::where('conversacionid', $conversacionid)
            ->where('usuarioid', $user->usuarioid)
            ->first();

        if (!$participante) {
            return response()->json([
                'message' => 'No tienes acceso a esta conversación.'
            ], 403);
        }

        $limit = (int) $request->query('limit', 20);
        $limit = max(1, min($limit, 100));
        $beforeId = $request->query('before_id');

        $query = Message::where('conversacionid', $conversacionid);

        if (!empty($beforeId)) {
            $query->where('mensajeid', '<', (int) $beforeId);
        }

        $mensajesDesc = $query
            ->with('participante.usuario')
            ->orderByDesc('mensajeid')
            ->orderByDesc('fech_envio')
            ->limit($limit + 1)
            ->get();

        $hasMore = $mensajesDesc->count() > $limit;

        if ($hasMore) {
            $mensajesDesc = $mensajesDesc->slice(0, $limit);
        }

        $mensajes = $mensajesDesc->sortBy('mensajeid')->values();

        // Actualizar ultim_lectura del participante actual al abrir/ver mensajes
        $participante->update([
            'ultim_lectura' => now()
        ]);

        return response()->json([
            'mensajes' => $mensajes,
            'has_more' => $hasMore
        ], 200);
    }

    // 3. Enviar un mensaje nuevo (o iniciar chat si no existe)
    public function enviarMensaje(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'conversacionid'  => 'nullable|integer|exists:conversacion,conversacionid',
            'destinatario_id' => 'required_without:conversacionid|integer|exists:usuario,usuarioid',
            'txt_msj'         => 'required|string|max:1000',
        ]);

        if (trim($request->txt_msj) === '') {
            return response()->json([
                'message' => 'El mensaje no puede estar vacío.'
            ], 422);
        }

        try {
            DB::beginTransaction();

            $conversacionid = $request->conversacionid;

            if ($conversacionid) {
                $pertenece = Participant::where('conversacionid', $conversacionid)
                    ->where('usuarioid', $user->usuarioid)
                    ->exists();

                if (!$pertenece) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'No perteneces a esta conversación.'
                    ], 403);
                }
            } else {
                $destinatarioId = (int) $request->destinatario_id;

                if ($destinatarioId === (int) $user->usuarioid) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'No puedes iniciar una conversación contigo mismo.'
                    ], 422);
                }

                // Reutilizar conversación existente entre ambos usuarios si ya existe
                $idsEmisor = Participant::where('usuarioid', $user->usuarioid)
                    ->pluck('conversacionid');

                $conversacionExistente = Participant::whereIn('conversacionid', $idsEmisor)
                    ->where('usuarioid', $destinatarioId)
                    ->value('conversacionid');

                if ($conversacionExistente) {
                    $conversacionid = $conversacionExistente;
                } else {
                    $conversacion = Conversation::create([
                        'tipo'   => 'privado',
                        'nombre' => 'Chat de Marketplace'
                    ]);
                    $conversacionid = $conversacion->conversacionid;

                    Participant::create([
                        'conversacionid' => $conversacionid,
                        'usuarioid'      => $user->usuarioid,
                        'ultim_lectura'  => now()
                    ]);

                    Participant::create([
                        'conversacionid' => $conversacionid,
                        'usuarioid'      => $destinatarioId,
                        'ultim_lectura'  => null
                    ]);
                }
            }

            $participante = Participant::where('conversacionid', $conversacionid)
                ->where('usuarioid', $user->usuarioid)
                ->first();

            $ahora = now();

            $mensaje = Message::create([
                'conversacionid' => $conversacionid,
                'participanteid' => $participante->participanteid,
                'txt_msj'        => trim($request->txt_msj),
                'fech_envio'     => $ahora,
                'estado'         => 'enviado'
            ]);

            if ($participante) {
                $participante->update([
                    'ultim_lectura' => $ahora
                ]);
            }

            DB::commit();

            return response()->json([
                'success'        => true,
                'message'        => 'Mensaje enviado',
                'conversacionid' => $conversacionid,
                'data'           => $mensaje->load('participante.usuario')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error'   => 'No se pudo enviar el mensaje',
                'detalle' => $e->getMessage()
            ], 500);
        }
    }
}
