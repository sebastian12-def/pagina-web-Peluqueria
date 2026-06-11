from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    Image,
)


OUTPUT = "Propuesta_Web_Reservas_Peluqueria_Cliente.pdf"
HOSTINGER_CAPTURE = r"C:\Users\PC\AppData\Local\Packages\MicrosoftWindows.Client.Core_cw5n1h2txyewy\TempState\ScreenClip\{DBDEF316-4985-446C-9A77-F5703898FFF9}.png"


BLUE = colors.HexColor("#1F4D78")
LIGHT_BLUE = colors.HexColor("#E8EEF5")
LIGHT_GRAY = colors.HexColor("#F4F6F9")
DARK = colors.HexColor("#1F2933")
MUTED = colors.HexColor("#5F6B7A")
GREEN = colors.HexColor("#2E7D32")


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="DocTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=22,
        textColor=BLUE,
        alignment=TA_CENTER,
        spaceAfter=4,
    )
)
styles.add(
    ParagraphStyle(
        name="Subtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=11,
        textColor=MUTED,
        alignment=TA_CENTER,
        spaceAfter=14,
    )
)
styles.add(
    ParagraphStyle(
        name="Section",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=13,
        textColor=BLUE,
        spaceBefore=10,
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        name="Body",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13,
        textColor=DARK,
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        name="Small",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8.2,
        leading=10.5,
        textColor=DARK,
        spaceAfter=3,
    )
)
styles.add(
    ParagraphStyle(
        name="ClientBullet",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.2,
        leading=12,
        leftIndent=13,
        firstLineIndent=-8,
        textColor=DARK,
        spaceAfter=3,
    )
)
styles.add(
    ParagraphStyle(
        name="TableHeader",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=8.2,
        leading=10,
        textColor=BLUE,
        alignment=TA_LEFT,
    )
)
styles.add(
    ParagraphStyle(
        name="TableCell",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=7.8,
        leading=9.8,
        textColor=DARK,
        alignment=TA_LEFT,
    )
)


def p(text, style="Body"):
    return Paragraph(text, styles[style])


def bullet(text):
    return Paragraph(f"- {text}", styles["ClientBullet"])


def section(text):
    return Paragraph(text, styles["Section"])


def callout(title, body, bg=LIGHT_BLUE):
    data = [[p(f"<b>{title}</b><br/>{body}", "Body")]]
    table = Table(data, colWidths=[6.65 * inch])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), bg),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#C9D5E2")),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return table


def make_table(headers, rows, widths):
    data = [[p(h, "TableHeader") for h in headers]]
    for row in rows:
        data.append([p(str(cell), "TableCell") for cell in row])
    table = Table(data, colWidths=[w * inch for w in widths], repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), LIGHT_BLUE),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#BFC9D4")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return table


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawCentredString(letter[0] / 2, 0.35 * inch, f"Propuesta prueba piloto - Pagina web de reservas | Pagina {doc.page}")
    canvas.restoreState()


doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=letter,
    rightMargin=0.65 * inch,
    leftMargin=0.65 * inch,
    topMargin=0.65 * inch,
    bottomMargin=0.65 * inch,
)

story = []
story.append(p("Propuesta de Pagina Web de Reservas", "DocTitle"))
story.append(p("Peluqueria / Barberia - Prueba piloto", "Subtitle"))
story.append(
    callout(
        "Resumen ejecutivo",
        "Mi propuesta es desarrollar una pagina web responsive para que sus clientes puedan registrarse, consultar servicios y agendar citas desde el celular. Usted tendria un panel privado para gestionar citas, servicios, horarios, disponibilidad y pagos manuales. Recomiendo iniciar con una prueba piloto para validar el uso real antes de invertir en funciones avanzadas como Wompi o WhatsApp automatico.",
    )
)
story.append(Spacer(1, 8))

story.append(section("1. Que incluiria la primera version"))
for item in [
    "Registro e inicio de sesion para clientes, con nombre, correo, telefono y contrasena.",
    "Panel privado para usted como peluquero/administrador.",
    "Servicios con precio y duracion para que el sistema calcule los horarios disponibles.",
    "Calendario de reservas con validacion para evitar que dos clientes tomen la misma hora.",
    "Estados de cita: pendiente, confirmada, cancelada y finalizada.",
    "Estado del peluquero: disponible, ocupado, pausado o fuera de horario.",
    "Mapa de ubicacion del negocio, QR de pago/contacto y registro manual de pagos.",
    "Diseno adaptable a celular, tablet y computador.",
]:
    story.append(bullet(item))

story.append(section("2. Opciones de publicacion"))
story.append(
    make_table(
        ["Opcion", "Que se usa", "Que paga usted", "Cuando conviene"],
        [
            [
                "Servicios separados",
                "Vercel para la pagina visual, Render para el backend, Neon/Supabase para la base de datos PostgreSQL y dominio comprado aparte.",
                "Puede iniciar con planes gratis o bajos. Debe pagar el dominio anual y, si se requiere estabilidad, un plan pago para backend/base de datos.",
                "Cuando se quiere probar primero gastando menos, aceptando que el sistema quede dividido en varias plataformas.",
            ],
            [
                "Hostinger Negocio",
                "Pagina, backend Node.js, base de datos MySQL, dominio, SSL, backups y correos empresariales dentro de Hostinger.",
                "Pago inicial aproximado de COP $667.200 + impuestos por 48 meses + 3 meses gratis. Luego renueva aproximadamente a COP $43.900/mes por 1 ano.",
                "Cuando se quiere tener todo mas ordenado en un solo proveedor y un solo panel de administracion.",
            ],
        ],
        [1.2, 2.3, 1.9, 1.25],
    )
)
story.append(Spacer(1, 6))

story.append(section("3. Opcion A: servicios separados"))
story.append(
    p(
        "En esta opcion yo publicaria cada parte del sistema en una plataforma especializada. La ventaja es que puede salir mas economico para iniciar y permite mantener PostgreSQL, que es una base de datos muy usada para aplicaciones modernas."
    )
)
story.append(
    make_table(
        ["Servicio", "Para que sirve", "Costo aproximado", "Que debe entender"],
        [
            ["Vercel", "Aloja la parte visual de la pagina, lo que ve el cliente desde el celular o computador.", "Puede iniciar gratis en plan Hobby.", "Es muy bueno para frontend, pero no seria el unico servicio del proyecto."],
            ["Render", "Aloja el backend: login, citas, servicios, roles y reglas del sistema.", "Plan gratis con limites; plan Basic desde US$6/mes.", "Para una prueba puede servir gratis, pero para estabilidad conviene plan pago."],
            ["Neon o Supabase", "Aloja la base de datos PostgreSQL donde se guardan clientes, citas, servicios y pagos.", "Puede iniciar gratis. Si crece, se evalua plan pago.", "Permite mantener PostgreSQL sin cambiar el proyecto actual."],
            ["Dominio", "Es el nombre de la pagina, por ejemplo www.nombrepeluqueria.com.", "Pago anual aparte.", "El dominio se conecta a la pagina aunque este en otra plataforma."],
        ],
        [1.05, 2.15, 1.35, 2.1],
    )
)
story.append(bullet("Ventaja principal: menor inversion inicial y buena escalabilidad tecnica."))
story.append(bullet("Desventaja principal: hay mas cuentas, paneles y configuraciones por administrar."))
story.append(bullet("Mi recomendacion en esta opcion: usarla si primero se quiere validar la idea con el menor costo posible."))

story.append(section("4. Opcion B: Hostinger Negocio"))
story.append(
    p(
        "En esta opcion yo publicaria la pagina y el sistema dentro de Hostinger. Es la alternativa mas clara para usted porque el hosting, dominio, SSL, correos, backups, backend y base de datos quedan centralizados en un solo proveedor."
    )
)
story.append(
    make_table(
        ["Concepto", "Detalle para el cliente"],
        [
            ["Plan recomendado", "Hostinger Negocio, porque permite aplicaciones Node.js y es suficiente para una prueba piloto de reservas."],
            ["Pago inicial", "COP $667.200 + impuestos. Ese valor cubre 48 meses y agrega 3 meses gratis, segun el plan mostrado."],
            ["Sobre el precio mensual", "El valor de COP $13.900/mes es promocional y se muestra como referencia. En la practica, Hostinger cobra el periodo completo por adelantado."],
            ["Renovacion", "Despues del periodo inicial, la renovacion seria aproximadamente COP $43.900/mes por 1 ano, segun la captura."],
            ["Incluye", "50 sitios web, 50 GB NVMe, dominio gratis 1 ano, 5 buzones de correo por 1 ano, 5 aplicaciones Node.js, SSL/HTTPS, backups diarios/manuales y CDN."],
            ["Base de datos", "Para que todo quede dentro de Hostinger se usaria MySQL. Esto implica adaptar el proyecto actual, que inicialmente esta en PostgreSQL."],
        ],
        [1.8, 4.85],
    )
)
story.append(bullet("Ventaja principal: un solo proveedor, un solo panel y una administracion mas sencilla para usted."))
story.append(bullet("Desventaja principal: el pago inicial es mas alto y para centralizar todo habria que usar MySQL en lugar de PostgreSQL."))
story.append(bullet("Mi recomendacion en esta opcion: usarla si se quiere una solucion mas formal, ordenada y facil de mantener a largo plazo."))
story.append(Spacer(1, 6))
story.append(p("<b>Captura de referencia del plan Hostinger Negocio:</b>", "Body"))
hostinger_img = Image(HOSTINGER_CAPTURE, width=1.9 * inch, height=6.2 * inch)
hostinger_img.hAlign = "CENTER"
story.append(hostinger_img)
story.append(PageBreak())

story.append(section("5. Pagos de las citas"))
story.append(
    make_table(
        ["Metodo", "Como funcionaria", "Que paga o recibe usted", "Recomendacion"],
        [
            [
                "QR del negocio",
                "La pagina muestra su QR de Nequi, Daviplata, Bancolombia u otro medio. El cliente paga escaneando el QR.",
                "El dinero llega directamente a su cuenta. La pagina solo registra manualmente si la cita esta pendiente, abonada o pagada.",
                "Es lo mas recomendable para la prueba piloto porque es simple y economico.",
            ],
            [
                "Wompi",
                "El cliente paga directamente desde la pagina y el sistema puede validar el pago automaticamente.",
                "Puede tener comisiones por transaccion y requiere una integracion adicional.",
                "Lo dejaria para una segunda fase, cuando ya se confirme que los clientes usan la pagina.",
            ],
        ],
        [1.05, 2.65, 1.4, 1.55],
    )
)

story.append(section("6. Que pagaria usted"))
for item in [
    "Desarrollo inicial: es el pago por construir la pagina, el sistema de reservas, el panel del peluquero y la configuracion inicial.",
    "Hosting o servicios de publicacion: depende de la opcion elegida, Hostinger o servicios separados.",
    "Dominio anual: es el nombre de la pagina. En Hostinger Negocio puede estar incluido gratis el primer ano.",
    "Base de datos: incluida si se usa MySQL en Hostinger; externa si se usa Neon/Supabase.",
    "Mantenimiento tecnico mensual: opcional, solo si desea que yo administre la pagina despues de entregarla.",
    "Integraciones futuras: Wompi, WhatsApp automatico, reportes avanzados o app movil, si se solicitan despues.",
]:
    story.append(bullet(item))

story.append(section("7. Mi mantenimiento tecnico opcional"))
story.append(
    p(
        "Si usted lo desea, yo puedo quedar como administrador tecnico de la pagina. Este servicio seria mensual y separado del costo de hosting o de los servicios externos."
    )
)
for item in [
    "Revisar que la pagina y el sistema sigan funcionando.",
    "Corregir errores tecnicos y actualizar el sistema cuando sea necesario.",
    "Configurar dominio, hosting, variables de entorno y base de datos.",
    "Gestionar respaldos y revisar informacion importante.",
    "Implementar mejoras futuras solicitadas por el cliente.",
]:
    story.append(bullet(item))

story.append(section("8. Recomendacion"))
story.append(
    callout(
        "Recomendacion para iniciar",
        "Si su prioridad es invertir menos al comienzo, yo recomiendo la opcion de servicios separados. Si su prioridad es tener todo mas ordenado, con un solo proveedor y una administracion mas clara, recomiendo Hostinger Negocio. Para la prueba piloto, tambien recomiendo iniciar con pago por QR directo al negocio y dejar Wompi para una segunda fase.",
        LIGHT_GRAY,
    )
)
story.append(Spacer(1, 8))

story.append(section("Fuentes consultadas"))
for source in [
    "Hostinger Web Hosting / Node.js Apps: https://www.hostinger.com/web-hosting",
    "Hostinger Node.js Hosting: https://www.hostinger.com/web-apps-hosting",
    "Vercel Pricing: https://vercel.com/pricing",
    "Render Pricing: https://render.com/pricing",
    "Neon Pricing: https://neon.com/pricing",
    "Supabase Pricing: https://supabase.com/pricing",
    "Wompi Colombia: https://wompi.co/co/",
    "Captura enviada del plan Hostinger Negocio en Colombia: COP $13.900/mes, pago total COP $667.200 + impuestos, renovacion COP $43.900/mes.",
]:
    story.append(bullet(source))

doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUTPUT)
