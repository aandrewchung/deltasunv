var prevScrollpos = window.scrollY;

window.onscroll = function() {
  var currentScrollPos = window.scrollY;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").style.top = "0";
  } else {
    document.getElementById("navbar").style.top = "-60px";
  }
  prevScrollpos = currentScrollPos;
}

var effectArr = 
  ["data-tilt-scale", 
  "data-tilt-full-page-listening", 
  "data-tilt-glare"];

var currEffect = 0;

function selectEffect(i) {
  var imgs = document.querySelectorAll(".img-effect");

  imgs.forEach(element => {
    if (element.vanillaTilt) {
      element.vanillaTilt.destroy();
    }

    element.removeAttribute(effectArr[currEffect]);

    element.setAttribute(effectArr[i], i === 0 ? "1.1" : "");

    if (i === 2) {
      element.setAttribute("data-tilt-max-glare", "0.8");
    }

    VanillaTilt.init(element);
  });

  currEffect = i;
}

function scrollToSection(sectionId) {
  $('html, body').animate({
      scrollTop: $(sectionId).offset().top - 50
  }, 'fast');
}
