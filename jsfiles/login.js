
const loginId = "ganai0000";
const password = "12345";
function crearField(uname,psw){
    uname.value = "";
    psw.value = "";
}
function verifyAndLogin(){
    const uname = document.getElementById("uname");
    const psw = document.getElementById("psw");
    if(loginId !== uname.value){
        alert("Username not Matched");
        crearField(uname,psw);
    }else if(password !== psw.value){
        alert("Password not Matched");
        crearField(uname,psw);
    }else{
        location.href = "./../public/admin-delmod.html";
    }
}

function goToPrevPage(){
    location.href = "./../public/index.html";
}