//Header Nav
const headerNav = document.querySelectorAll(".header__nav ul li");

if(headerNav.length > 0) {
  headerNav.forEach((item)=> {
    item.addEventListener("mouseenter", () => {
      item.querySelector('a').style.color = '#fff'; 
      anime({
        targets: item,
        translateY: [-10, 0, 10, 0],
        opacity: [1, 0, 0, 1],
        duration: 600,
        easing: 'linear',
        easing: 'easeInOutQuad'
      });
    })
    item.addEventListener("mouseout", () => {
      anime({
        targets: item,
        translateY: 0,
        duration: 100,
        easing: 'linear'
      });
    });
    item.addEventListener('mouseleave', () => {
      item.querySelector('a').style.color = 'gray'; 
    })
  })
}
//End Header Nav
//Header Login
const headerLogin = document.querySelector('.header__login')

if(headerLogin) {
  const icon = headerLogin.querySelector('i')
  const text = headerLogin.querySelector('a')
  if(text && icon) {
    headerLogin.addEventListener("mouseenter", () => {
      anime({
        targets: text,
        translateY: [-10, 0, 10, 0],
        opacity: [1, 0, 0, 1],
        duration: 600,
        easing: 'linear',
        easing: 'easeInOutQuad'
      });
      anime({
        targets: icon,
        translateX: [-10, 0, 10, 0],
        opacity: [1, 0, 0, 1],
        duration: 600,
        easing: 'linear',
        easing: 'easeInOutQuad'
      });
    })
    headerLogin.addEventListener("mouseout", () => {
      anime({
        targets: text,
        translateY: 0,
        duration: 100,
        easing: 'linear'
      });
      anime({
        targets: icon,
        translateX: 0,
        duration: 100,
        easing: 'linear'
      });
    });
  }
}
// End Header Login
//Dashboard Content 
const dashboardContent = document.querySelectorAll('.dashboard__animation div')

if(dashboardContent.length > 0) {
  dashboardContent.forEach((item) => {
    anime({
      targets: item,
      translateX: function(el) {
        return anime.random(-250, 250)
      },
      translateY: function(el, i) {
        return (anime.random(-250, 250) + anime.random(-250, 250) * i);
      },
      scale: function(el, i, l) {
        return (l - i) + .25;
      },
      rotate: function() { return anime.random(-360, 360); },
      borderRadius: function() { return ['50%', anime.random(10, 35) + '%']; },
      duration: function() { return anime.random(1200, 1800); },
      delay: function() { return anime.random(0, 400); },
      direction: 'alternate',
      loop: true
    })
  })
}
//End Dashboard Content