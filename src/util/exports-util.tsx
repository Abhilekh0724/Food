import { Row } from '@tanstack/react-table';
import { ExportToCsv } from 'export-to-csv-file';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToCsv = (rows: Row<any>[], filename: string) => {
  const rowData = rows.map((row) => row.original);

  const csvExporter = new ExportToCsv({
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: true,
    filename,
  });

  csvExporter.generateCsv(rowData);
};



export const printPDF = (rows: Row<any>[], filename: string) => {
  const rowData = rows.map((row) => row.original);

  if (!rowData.length) return;

  const doc = new jsPDF();

  // Extract headers from object keys
  const headers = Object.keys(rowData[0]);
  const data = rowData.map((item) => headers.map((key) => item[key]));

  autoTable(doc, {
    head: [headers],
    body: data,
    styles: { fontSize: 8 },
  });

  doc.save(`${filename}.pdf`);
};
