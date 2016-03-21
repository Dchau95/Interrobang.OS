//Array of files for the processes to open
var arrDirectory = [
    "Dummy.CSV",
    "Contact.CSV",
    "Bank.CSV",
    "password.CSV",
    "read.CSV",
    "vector.CSV",
    "stats.CSV"
];

//A hash where each CSV maps to its respective content
var hashDirectory = {
    "Contact.CSV": "David: Secretary, Tony: Gangster, Jason: Dancer, Benson: Duke, Andrew: Gangster, Thomas: Traitor, Matt: Lame",
    "Bank.CSV": "100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000",
    "password.CSV": "popchiek:hi,gamrgod88:l337420,slides:mcgee,taeyona:taeyona,thommy:commie",
    "read.CSV": "1, 2, 4, 6, 7, 11, 3, 2, 7, 9, 10, 3, 4, 11, 5, 7, 8, 10, 1, 5, 7, 4, 7, 10, 11, 12, 13, 5, 7, 8, 100, 11, 12, 32, 200",
    "vector.CSV": "<15.6,7.5,-15.3>, <-16.7,-3.8,6.8>, <-8.6,2.8,-11>, <-0.9,16.8,-9.7>, <-3.7,6,6.7>, <13.5,7.4,17.1>, <-18,-18.2,16.6>, <-0.6,9.1,17.4>, <12.8,-19.3,14.6>, <4.6,-4.3,-1.5>, <6,-13.5,-13.9>, <10.7,-10.2,2.3>, <-2.4,-3.6,-14.9>, <1.8,10.8,17.1>, <12.1,-12.9,-1.6>, <-1.2,-19.3,-19>, <-8.9,-17.3,-17.1>, <-12.3,2.2,12>, <-19.6,-9.8,8>, <15,14.8,18.9>",
    "stats.CSV": "3, 4, 11, 5, 7, 8, 10, 1, 5, 7, 4, 7, 10, 11, 12, 13, 5, 7, 8, 100, 11, 12, 32, 200"
};