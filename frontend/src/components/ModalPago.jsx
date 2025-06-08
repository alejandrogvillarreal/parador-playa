export default function ModalPago({
  visible,
  onCancelar,
  onConfirmar,
  montoTotal,
  moneda,
  metodoPago,
  titulo = "Simulación de Pago",
  descripcion = "Este es un entorno de prueba. Al confirmar se simulará el pago.",
}) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h3 className="text-xl font-semibold mb-4">{titulo}</h3>
        <p className="mb-2">
          <strong>Total a pagar:</strong> ${montoTotal?.toFixed(2)} {moneda}
        </p>
        <p className="mb-4">
          <strong>Método de pago:</strong> {metodoPago}
        </p>
        <p className="text-sm text-gray-500 mb-6">{descripcion}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onConfirmar}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
          >
            Confirmar pago
          </button>
          <button
            onClick={onCancelar}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
