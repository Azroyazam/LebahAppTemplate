<%
String randomNo = lebah.db.UniqueID.getUID();
response.sendRedirect("c/?rndId=" + randomNo); 
%>