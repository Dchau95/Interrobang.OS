var aContactCsv = ["David Chau", ",", "George Jone", ",", "Phuc Chau", ",", "Sa Chau", ",",
                  "Hung Do", ",", "Darin Vergara", ",", "Sam Gluss", ",", "Em Santos", ",",
                  "Nhan Nguyen", ",", "Thomas Nguyen", ",", "Tony Tran", ",", "Paul Klein", ",",
                  "Brook Thomas", ",", "Gilbert Bui", ",", "Hari Mannivan", ",", "Eric Chen", ",",
                  "Allen Space", ",", "Ivan Gonzalez", ",", "Kenny Luo", ",", "Nicu Listana", ",",
                  "Khanh Le", ",", "Kenny Chao", ",", "Dan Roberts", ",", "Anna Sever", ",",
                  "Tricia Nemiroff", ",", "Chris Lang", ",", "Thomas Tse", ",", "Benson Zhang", ",",
                  "Sang Saephan", ",", "Chitose Kagami", ",", "Derek Bantug", ",", "Linden Chiu", ",",
                  "Roger Schrag", ",", "Jay Chan", ",", "Tai-An Cha", ",", "Tom Rike", ",",
                  "Kevin Wong", ",", "Jimmy Tran", ",", "Josh Johansen", ",", "Bryan Chen", ",",
                  "Randy Phan", ",", "Joyce Yee", ",", "Abigail Jem", ",", "Tiffany Ku", ",",
                  "Alvin Lu", ",", "Matt Wischoff", ",", "Camille Davis", ",", "Herp Derp", ",",
                  "Frank Koutoulas", ",", "Anthony Souza"];


function findContact() {
    "use strict";
    var contact = "Matt Wischoff";
    var nIndex;
    for (nIndex = 0; nIndex < aContactCsv.length; nIndex++) {
        if (contact === aContactCsv[nIndex]) {
            return contact;
        }
    }
}
