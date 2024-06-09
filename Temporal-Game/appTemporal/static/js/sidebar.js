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


