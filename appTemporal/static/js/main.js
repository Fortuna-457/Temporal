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


const shrink_btn = document.querySelector(".shrink-btn");
const search = document.querySelector(".search");
const sidebar_links = document.querySelectorAll(".sidebar-links a");
const active_tab = document.querySelector(".active-tab");
const shortcuts = document.querySelector(".sidebar-links h4");
const tooltip_elements = document.querySelectorAll(".tooltip-element");

let activeIndex;

shrink_btn.addEventListener("click", () => {
  document.body.classList.toggle("shrink");
  setTimeout(moveActiveTab, 400);

  shrink_btn.classList.add("hovered");

  setTimeout(() => {
    shrink_btn.classList.remove("hovered");
  }, 500);
});

search.addEventListener("click", () => {
  document.body.classList.remove("shrink");
  search.lastElementChild.focus();
});

function moveActiveTab() {
  let topPosition = activeIndex * 58 + 2.5;

  if (activeIndex > 3) {
    topPosition += shortcuts.clientHeight;
  }

  active_tab.style.top = `${topPosition}px`;
}

function changeLink() {
  sidebar_links.forEach((sideLink) => sideLink.classList.remove("active"));
  this.classList.add("active");

  activeIndex = this.dataset.active;

  moveActiveTab();
}

sidebar_links.forEach((link) => link.addEventListener("click", changeLink));

function showTooltip() {
  let tooltip = this.parentNode.lastElementChild;
  let spans = tooltip.children;
  let tooltipIndex = this.dataset.tooltip;

  Array.from(spans).forEach((sp) => sp.classList.remove("show"));
  spans[tooltipIndex].classList.add("show");

  tooltip.style.top = `${(100 / (spans.length * 2)) * (tooltipIndex * 2 + 1)}%`;
}

tooltip_elements.forEach((elem) => {
  elem.addEventListener("mouseover", showTooltip);
});

