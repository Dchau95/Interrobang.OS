<!DOCTYPE html>
<html>
    
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>GETTING STARTED WITH BRACKETS</title>
        <meta name="description" content="An interactive getting started guide for Brackets.">
        <link rel="stylesheet" href="main.css">
    </head>
    <body>
        <script>
            var arr = [];
            var balance = 0;
            
            
            for(var i=0,t=99;i<t;i++)
            {
                var num = Math.floor(Math.random()*200) + 1; // this will get a number between 1 and 200
                num *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases
                arr.push(num)
                balance += num;
            }
            
            for(var i=0;i<arr.length;i++)
            {
                balance += arr[i];
            }
            document.write("Balance of bank account is: $" + balance);
            
        </script>
        
    </body>
</html>