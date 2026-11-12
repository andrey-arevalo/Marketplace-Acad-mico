<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\Participant;
use App\Models\Message;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    // 1. Mostrar la bandeja de entrada (Lista de conversaciones del usuario logueado)
    public function misConversaciones(Request $request)
    {
        $user = $request->user();

        // Buscamos las conversaciones donde el usuario participa a través de la tabla participante
        $conversaciones = Conversation::whereHas('participantes', function($query) use ($user) {
            $query->where('usuarioid', $user->usuarioid);
        })->with(['participantes.usuario', 'mensajes' => function($q) {
            $q->latest()->limit(1); // Trae el último mensaje para mostrarlo como vista previa
        }])->get();

        return response()->json($conversaciones, 200);
    }

    // 2. Ver los mensajes de una conversación específica
    public function verMensajes(Request $request, $conversacionid)
    {
        $user = $request->user();

        // Verificar que el usuario pertenezca a esta conversación por seguridad
        $esParticipante = Participant::where('conversacionid', $conversacionid) // (O si relacionas participante con conversacion)
                                    ->where('usuarioid', $user->usuarioid)
                                    ->exists();
        
        // Obtenemos los mensajes ordenados por fecha de envío
        $mensajes = Message::where('conversacionid', $conversacionid)
                           ->with('participante.usuario')
                           ->orderBy('fech_envio', 'asc')
                           ->get();

        return response()->json($mensajes, 200);
    }

    // 3. Enviar un mensaje nuevo (o iniciar chat si no existe)
    public function enviarMensaje(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'conversacionid' => 'nullable|integer|exists:conversacion,conversacionid',
            'destinatario_id' => 'required_without:conversacionid|integer|exists:usuario,usuarioid',
            'txt_msj' => 'required|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            $conversacionid = $request->conversacionid;

            // Si no hay una conversación creada aún, la creamos al mandar el primer mensaje
            if (!$conversacionid) {
                $conversacion = Conversation::create([
                    'tipo' => 'privado',
                    'nombre' => 'Chat de Marketplace'
                ]);
                $conversacionid = $conversacion->conversacionid;

                // Añadir al emisor como participante
                Participant::create([
                    'conversacionid' => $conversacionid, // Asegúrate de tener este campo en tu tabla participante si lo requiere, o ajusta según tu diagrama
                    'usuarioid' => $user->usuarioid
                ]);

                // Añadir al destinatario como participante
                Participant::create([
                    'conversacionid' => $conversacionid,
                    'usuarioid' => $request->destinatario_id
                ]);
            }

            // Buscar el participanteid del usuario actual en esta conversación
            $participante = Participant::where('conversacionid', $conversacionid)
                                       ->where('usuarioid', $user->usuarioid)
                                       ->first();

            // Guardar el mensaje
            $mensaje = Message::create([
                'conversacionid' => $conversacionid,
                'participanteid' => $participante->participanteid,
                'txt_msj' => $request->txt_msj,
                'estado' => 'enviado'
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Mensaje enviado',
                'data' => $mensaje->load('participante.usuario')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'No se pudo enviar el mensaje', 'detalle' => $e->getMessage()], 500);
        }
    }
}
