#### Bericht: 3D TIC TAC TOE

> Werthmüller Melvin, Christensen Christopher, Arnold Lukas

In dieser Projektarbeit wurde eine modifizierte Version des Tic-Tac-Toe (https://en.wikipedia.org/wiki/Tic-tac-toe) im dreidimensionalem Raum entwickelt. Das Spiel ist unter folgendem Link verfügbar: https://chefe.github.io/3d-tic-tac-toe/webgl/index.html

<img src="3dtictactoe.png" style="width:75%">

##### Technologie

Das Programm wurde mit der Verwendung von WebGL realisiert. Die Game Logik wurde mit Vanilla Javascript implementiert.

##### Visueller Aufbau

Das Grid setzt sich aus 27 einzelnen Würfel zusammen. Die Ansicht auf der linken Seite stellt die aktiv ausgewählte Ebene in einem 3x3 Grid dar. Vom Spieler markierte Felder werden mit einer farbigen Kugel dargestellt. Diese werden, zur optischen Verschönerung, von einer Lichtquelle beleuchtet. Im Programm existiert jeweils nur ein Objekt (Würfel, Kugel), welche unterschiedlich transformiert und gezeichnet werden. 

##### Game Logik

Um den Spielstand an den WebGL-Teil des Programms zu übergeben wurde eine Schnittstelle erstellt. 

<img src="api.png">

Die Identifikation der Würfel sind mit +1 oder -1, in allen Achsen, um den Mittelpunkt [0,0,0] angegeben.