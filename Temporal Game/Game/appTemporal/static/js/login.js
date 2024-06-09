console.clear();

const loginBtn = document.getElementById('login');
const signupBtn = document.getElementById('signup');

loginBtn.addEventListener('click', (e) => {
	let parent = e.target.parentNode.parentNode;
	Array.from(e.target.parentNode.parentNode.classList).find((element) => {
		if(element !== "slide-up") {
			parent.classList.add('slide-up')
		}else{
			signupBtn.parentNode.classList.add('slide-up')
			parent.classList.remove('slide-up')
		}
	});
});

signupBtn.addEventListener('click', (e) => {
	let parent = e.target.parentNode;
	Array.from(e.target.parentNode.classList).find((element) => {
		if(element !== "slide-up") {
			parent.classList.add('slide-up')
		}else{
			loginBtn.parentNode.parentNode.classList.add('slide-up')
			parent.classList.remove('slide-up')
		}
	});
});


$(document).ready(function(){
    // Mostrar/ocultar contraseña
    $(".icon").mouseenter(function(){
        var input = $(this).siblings("input");
        input.attr("type", "text");
    }).mouseleave(function(){
        var input = $(this).siblings("input");
        if (!input.hasClass("show-password")) {
            input.attr("type", "password");
        }
    });

    // Cambiar clase y tipo de entrada al hacer clic en el icono
    $(".icon").click(function(){
        $(this).toggleClass("bx-show-alt bx-hide");
        var input = $(this).siblings("input");
        if (input.attr("type") == "password") {
            input.attr("type", "text").addClass("show-password");
        } else {
            input.attr("type", "password").removeClass("show-password");
        }
    });
});
