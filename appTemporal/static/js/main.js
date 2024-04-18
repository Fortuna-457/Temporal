$(document).ready(function() {
    console.log("hola pedro 1 ç");

    // Define the parallax effect for each image
    var parallaxEffects = {
        ".parallax__bg": 0.01,
        ".parallax__dust": 0.03,
        ".parallax__luna": 0.02,
        ".parallax__jax": 0.02,
        ".parallax__manny": 0.02, 
    };

    console.log(parallaxEffects);

    //Mousemove event handler
    $(document).on("mousemove", function(event) {
        // Calculate mouse movement
        var mouseX = event.pageX;
        var mouseY = event.pageY;

        // Update position for each image based on mouse movement
        $.each(parallaxEffects, function(selector, speed) {
            var $img = $(selector);
            var offsetX = ($img.offset().left + $img.width() / 2) - mouseX;
            var offsetY = ($img.offset().top + $img.height() / 2) - mouseY;
            var transformX = offsetX * speed;
            var transformY = offsetY * speed;
            $img.css("transform", "translate(" + transformX + "px, " + transformY + "px)");
        });
    });


    $('#togglePassword').click(function(){
        var passwordField = $('#user');
        var passwordFieldType = passwordField.attr('type');
        if(passwordFieldType == 'password'){
            passwordField.attr('type', 'text');
            $(this).removeClass('bx-lock-alt').addClass('bxs-lock-alt');
        } else {
            passwordField.attr('type', 'password');
            $(this).removeClass('bxs-lock-alt').addClass('bx-lock-alt');
        }
    });


});


let activeIndex;

$(".shrink-btn").click(function() {
  $("body").toggleClass("shrink");
  setTimeout(moveActiveTab, 400);

  $(this).addClass("hovered");

  setTimeout(() => {
    $(this).removeClass("hovered");
  }, 500);
});

$(".search").click(function() {
  $("body").removeClass("shrink");
  $(this).children().last().focus();
});

function moveActiveTab() {
  let topPosition = activeIndex * 58 + 2.5;

  if (activeIndex > 3) {
    topPosition += $(".sidebar-links h4").height();
  }

  $(".active-tab").css("top", `${topPosition}px`);
}

function changeLink() {
  $(".sidebar-links a").removeClass("active");
  $(this).addClass("active");

  activeIndex = $(this).data("active");

  moveActiveTab();
}

$(".sidebar-links a").click(changeLink);

function showTooltip() {
  let tooltip = $(this).parent().children().last();
  let spans = tooltip.children();
  let tooltipIndex = $(this).data("tooltip");

  spans.removeClass("show");
  $(spans[tooltipIndex]).addClass("show");

  tooltip.css("top", `${(100 / (spans.length * 2)) * (tooltipIndex * 2 + 1)}%`);
}

$(".tooltip-element").mouseover(showTooltip);

$(".navbar").mouseenter(function() {
  $("body").removeClass("shrink");
});

$(".navbar").mouseleave(function() {
  $("body").addClass("shrink");
});
