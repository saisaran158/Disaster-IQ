import smtplib
from email.mime.text import MIMEText

try:
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login('disasteriq8@gmail.com', 'cbmm umup fabv belt')
    msg = MIMEText('Test email content')
    msg['Subject'] = 'Test Subject'
    msg['From'] = 'disasteriq8@gmail.com'
    msg['To'] = '717824p140@kce.ac.in'
    server.sendmail('disasteriq8@gmail.com', '717824p140@kce.ac.in', msg.as_string())
    server.quit()
    print("SUCCESS: SMTP connection and email delivery succeeded!")
except Exception as e:
    print("ERROR:", str(e))