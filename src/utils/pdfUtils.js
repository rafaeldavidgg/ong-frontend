import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate } from "./dateUtils";
import logo from "../assets/logo.png";
import { getTipoAutismoLabel } from "./tipoAutismoUtils";

const PRIMARY_COLOR = [16, 69, 114];
const TEXT_COLOR = [0, 0, 0];
const LINE_HEIGHT = 8;

export const generateActividadPDF = (actividad) => {
  const doc = new jsPDF();

  let y = 20;

  const logoWidth = 15;
  const logoHeight = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 15;

  const img = new Image();
  img.src = logo;

  img.onload = () => {
    doc.addImage(
      img,
      "PNG",
      pageWidth - marginX - logoWidth,
      y - 5,
      logoWidth,
      logoHeight
    );

    doc.setFontSize(20);
    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFont("helvetica", "bold");
    doc.text(`Informe de actividad`, 15, y);

    y += LINE_HEIGHT;

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...TEXT_COLOR);
    doc.text(`"${actividad.nombre}"`, 15, y);

    y += LINE_HEIGHT;

    doc.setFontSize(12);
    const leftText = `${formatDate(actividad.fecha)}`;
    const rightText = `${actividad.creadaPor?.nombre || "-"} ${
      actividad.creadaPor?.apellido || ""
    }`;
    const rightTextWidth = doc.getTextWidth(rightText);
    doc.text(leftText, marginX, y);
    doc.text(rightText, pageWidth - marginX - rightTextWidth, y);

    y += LINE_HEIGHT * 1.5;

    const tipo = actividad.tipoActividad;
    if (tipo) {
      doc.setFontSize(12);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...PRIMARY_COLOR);
      doc.text(`Duración estimada:`, 15, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...TEXT_COLOR);
      doc.text(`${tipo.duracion || "-"} minutos`, 57, y);
      y += LINE_HEIGHT;

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...PRIMARY_COLOR);
      doc.text(`Descripción:`, 15, y);
      y += LINE_HEIGHT;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...TEXT_COLOR);
      const descripcionLines = doc.splitTextToSize(
        tipo.descripcion || "-",
        180
      );
      doc.text(descripcionLines, 15, y);
      y += descripcionLines.length * LINE_HEIGHT;

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...PRIMARY_COLOR);
      doc.text(`Materiales necesarios:`, 15, y);
      y += LINE_HEIGHT;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...TEXT_COLOR);
      const materialesLines = doc.splitTextToSize(tipo.materiales || "-", 180);
      doc.text(materialesLines, 15, y);
      y += materialesLines.length * LINE_HEIGHT * 1.5;
    }

    autoTable(doc, {
      startY: y,
      head: [["Usuarios participantes"]],
      body:
        actividad.realizadaPor?.length > 0
          ? actividad.realizadaPor.map((u) => [`${u.nombre} ${u.apellido}`])
          : [["Ninguno"]],
      headStyles: {
        fillColor: PRIMARY_COLOR,
        textColor: [255, 255, 255],
        halign: "center",
        fontStyle: "bold",
      },
      styles: {
        fontSize: 11,
        textColor: [0, 0, 0],
        halign: "left",
        valign: "middle",
        cellPadding: 3,
        lineColor: [220, 220, 220],
        lineWidth: 0.1,
      },
      margin: { left: 15 },
      tableWidth: 80,
    });

    autoTable(doc, {
      startY: y,
      head: [["Ejecutada por"]],
      body:
        actividad.ejecutadaPor?.length > 0
          ? actividad.ejecutadaPor.map((t) => [`${t.nombre} ${t.apellido}`])
          : [["Ninguno"]],
      headStyles: {
        fillColor: PRIMARY_COLOR,
        textColor: [255, 255, 255],
        halign: "center",
        fontStyle: "bold",
      },
      styles: {
        fontSize: 11,
        textColor: [0, 0, 0],
        halign: "left",
        valign: "middle",
        cellPadding: 3,
        lineColor: [220, 220, 220],
        lineWidth: 0.1,
      },
      margin: { left: 110 },
      tableWidth: 80,
    });

    doc.output("dataurlnewwindow");
  };
};

export const generateInformeUsuarioPDF = (
  usuario,
  actividades,
  mesSeleccionado
) => {
  const doc = new jsPDF();

  const fechaFormateada = new Date().toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const [year, month] = mesSeleccionado.split("-");
  const nombreMes = new Date(year, month - 1).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 15;
  const logoWidth = 15;
  const logoHeight = 15;
  let y = 20;

  const img = new Image();
  img.src = logo;

  img.onload = () => {
    doc.addImage(
      img,
      "PNG",
      pageWidth - marginX - logoWidth,
      y - 5,
      logoWidth,
      logoHeight
    );

    doc.setFontSize(20);
    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFont("helvetica", "bold");
    doc.text("Informe de actividades", marginX, y);

    y += LINE_HEIGHT;

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...TEXT_COLOR);
    doc.text(`${nombreMes}`, marginX, y);

    y += LINE_HEIGHT * 1.5;

    doc.setFontSize(12);
    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFont("helvetica", "bold");
    doc.text("Datos del usuario:", marginX, y);

    y += LINE_HEIGHT;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...TEXT_COLOR);
    doc.text(`Nombre: ${usuario.nombre} ${usuario.apellido}`, marginX, y);
    y += LINE_HEIGHT;
    doc.text(`DNI: ${usuario.dni}`, marginX, y);
    y += LINE_HEIGHT;
    doc.text(
      `Fecha de nacimiento: ${formatDate(
        new Date(usuario.fechaNacimiento)
      )}`,
      marginX,
      y
    );
    y += LINE_HEIGHT;
    doc.text(
      `Tipo de autismo: ${getTipoAutismoLabel(usuario.tipoAutismo)}`,
      marginX,
      y
    );
    y += LINE_HEIGHT;
    doc.text(`Grado de autismo: ${usuario.gradoAutismo}%`, marginX, y);
    y += LINE_HEIGHT;
    doc.text(`Grupo de trabajo: ${usuario.grupoTrabajo}`, marginX, y);
    y += LINE_HEIGHT * 1.5;

    if (actividades.length === 0) {
      doc.setTextColor(150, 0, 0);
      doc.text("No hay actividades registradas este mes.", marginX, y);
    } else {
      autoTable(doc, {
        startY: y,
        head: [["Nombre", "Fecha", "Tipo"]],
        body: actividades.map((a) => [
          a.nombre,
          formatDate(new Date(a.fecha)),
          a.tipoActividad?.nombreTipo || "—",
        ]),
        headStyles: {
          fillColor: PRIMARY_COLOR,
          textColor: [255, 255, 255],
          halign: "left",
          fontStyle: "bold",
        },
        styles: {
          fontSize: 11,
          textColor: TEXT_COLOR,
          cellPadding: 3,
        },
        margin: { left: marginX },
      });
    }

    doc.setTextColor(...TEXT_COLOR);
    doc.text(
      `Fecha de generación: ${fechaFormateada}`,
      marginX,
      doc.internal.pageSize.height - 10
    );

    doc.output("dataurlnewwindow");
  };
};
