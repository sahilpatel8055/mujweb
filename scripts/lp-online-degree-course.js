jQuery(document).ready(function ($) {
  $('li#select2-institution-a8-result-v2db-MAHE').hide();
});

function enroll_now_btn(courseName, institutuion) {
  $('.enroll-now-form input[name="course_name"]').val(courseName);
  $('.enroll-now-form input[name="institution"]').val(institutuion);
}

if ($(window).width() < 992) {
  document.addEventListener("DOMContentLoaded", function () {
    const banner = document.querySelector(".online-degree-courses-banner");
    const enrollButton = document.querySelector(".top-enroll");
    const footerenrollButton = document.querySelector(".mobileWidgetBottom");
    const dotContainer = document.querySelector(".blinkdot-container"); // Blinking dot
    footerenrollButton.style.display = "none";
    enrollButton.style.display = "none";
    if (banner) {
      if (dotContainer) dotContainer.style.display = "flex";

      // condition for home page with the banner
      document.addEventListener("scroll", function () {
        const bannerBottom = banner.getBoundingClientRect().bottom;
        if (bannerBottom <= 0) {
          if (dotContainer) dotContainer.style.display = "none";
          enrollButton.style.display = "block";
          if (footerenrollButton && $(window).width() <= 992) {
            footerenrollButton.style.display = "block";
          }
        } else {
          if (dotContainer) dotContainer.style.display = "flex";
          enrollButton.style.display = "none";
          if (footerenrollButton && $(window).width() <= 992) {
            footerenrollButton.style.display = "none";
          }
        }
      });
    } else {
      // condition for other pages without home banner
      if (dotContainer) dotContainer.style.display = "flex";
      enrollButton.style.display = "block";
      if (footerenrollButton && $(window).width() <= 992) {
        footerenrollButton.style.display = "block";
      }
    }
  });
}
setTimeout(function() {
$("#downloadForm input[name='LeadFormName']").val("Banner Download Form");
}, 3000);