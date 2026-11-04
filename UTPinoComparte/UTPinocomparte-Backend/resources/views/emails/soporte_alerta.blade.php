<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Nuevo Reporte de Soporte</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333;">
    <h2>Nuevo reporte de soporte recibido</h2>
    <p>Se ha registrado una nueva incidencia desde la plataforma:</p>
    
    <ul>
        <li><strong>Tipo de Problema:</strong> {{ $soporte->tipoProblema }}</li>
        <li><strong>Nombre:</strong> {{ $soporte->nombre }}</li>
        <li><strong>Correo:</strong> {{ $soporte->correo }}</li>
        <li><strong>Teléfono:</strong> {{ $soporte->telefono ?? 'No especificado' }}</li>
        <li><strong>N° de Transacción:</strong> {{ $soporte->transaccion ?? 'Ninguna' }}</li>
    </ul>

    <h3>Descripción del caso:</h3>
    <p style="background: #f4f4f4; padding: 10px; border-radius: 5px;">
        {{ $soporte->desc_report }}
    </p>

    <p style="font-size: 12px; color: #777;">Este mensaje fue generado automáticamente por el sistema de UTPINO Comparte.</p>
</body>
</html>