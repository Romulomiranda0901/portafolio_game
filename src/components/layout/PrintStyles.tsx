/**
 * PrintStyles: inyecta estilos específicos para impresión.
 * Oculta elementos con .no-print y optimiza márgenes.
 */

export default function PrintStyles() {
  return (
    <style>
      {`
      @media print {
        .no-print { display: none !important; }
        header, footer { display: none !important; }
        #print-area { padding: 0 !important; }
        a { text-decoration: none; color: inherit; }
        @page { margin: 16mm; }
        body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      }
    `}
    </style>
  )
}
