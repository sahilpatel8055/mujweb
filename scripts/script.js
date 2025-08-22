// Tab Functionality
document.addEventListener('DOMContentLoaded', () => {
  const tabGroups = document.querySelectorAll('.tabs');
  tabGroups.forEach(group => {
    const tabButtons = group.querySelectorAll('.tab-btn');
    const tabPanels = group.querySelectorAll('.tab-panel');
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        group.querySelector(`#${tabId}`).classList.add('active');
      });
    });
  });
});

// Accordion
document.addEventListener("DOMContentLoaded", () => {
  const accordionHeaders = document.querySelectorAll(".accordion-header");
  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      content.classList.toggle("open");
      header.classList.toggle("open");
      const icon = header.querySelector(".accordion-icon");
      if (icon) {
        icon.textContent = content.classList.contains("open") ? "-" : "+";
      }
      accordionHeaders.forEach((h) => {
        if (h !== header) {
          h.nextElementSibling.classList.remove("open");
          h.classList.remove("open");
          const hIcon = h.querySelector(".accordion-icon");
          if (hIcon) {
            hIcon.textContent = "+";
          }
        }
      });
    });
  });
});

function toggleBodyScroll(toggle) {
  //alert(toggle);
  let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  if (toggle) {
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = scrollbarWidth + "px";

    // Adjust fixed header width
    let header = document.querySelector("header");
    if (header) {
      header.style.width = `calc(100% - ${scrollbarWidth}px)`;
    }
  } else {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";

    // Reset header width
    let header = document.querySelector("header");
    if (header) {
      header.style.width = ""; // Reset to default 100%
    }
  }
}

// Start of Header Code
document.addEventListener('DOMContentLoaded', () => {
  const overlaymenu = document.getElementById('overlay');
  const header = document.querySelector('.header');
  const popups = document.querySelectorAll('.popup');
  document.querySelectorAll('.submenu').forEach((submenu) => {
    submenu.style.display = 'none';
  });

  document.querySelectorAll('.menu-item.has-submenu .menu-text').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const parentItem = link.parentElement; // Get the parent menu item
      const submenu = link.nextElementSibling; // Get the corresponding submenu
      const dotContainer = document.querySelector(".blinkdot-container"); // Blinking dot

      if (dotContainer) dotContainer.style.display = "none";
      // Close any open popup
      popups.forEach((popup) => {
        popup.classList.add('hidden');
      });
      overlaymenu.classList.remove('show');
      // Toggle active class and submenu visibility
      if (parentItem.classList.contains('active')) {
        parentItem.classList.remove('active');
        submenu.style.display = 'none'; // Hide submenu
        if (submenu.classList.contains('megamenu')) {
          overlaymenu.classList.remove("show");
          //overlaymenu.classList.add('hidden');
          //document.body.style.overflow = '';
          toggleBodyScroll(false); // Restore scrollbar
        }
      } else {
        // Hide all submenus and remove 'active' class
        document.querySelectorAll(".menu-item.has-submenu").forEach((item) => {
          item.classList.remove("active");
          const sub = item.querySelector(".submenu");
          if (sub) sub.style.display = "none";
        });
        //overlaymenu.classList.add('hidden');
        overlaymenu.classList.remove("show");
        //document.body.style.overflow = '';
        toggleBodyScroll(false); // Ensure scrollbar is restored
        // Show clicked submenu and add 'active' class
        parentItem.classList.add("active");
        submenu.style.display = "flex"; // Show submenu
        if (submenu.classList.contains("megamenu")) {
          //overlaymenu.classList.remove('hidden');
          overlaymenu.classList.add("show");
          //document.body.style.overflow = "hidden";
          toggleBodyScroll(true); // Hide scrollbar but prevent content shift
        }
      }
      if (!$(".overlay").hasClass("show")) {
        //$('body').removeClass('overflow-hidden');
        toggleBodyScroll(false); // Ensure scrollbar is restored
      }
    });
  });

  // Close submenu menu when clicking outside
  document.addEventListener('click', (e) => {
    const isClickInsideHeader = e.target.closest(".header");
    const isClickInsideMenu = e.target.closest(".menu-item");
    const banner = document.querySelector(".home-banner");
    const dotContainer = document.querySelector(".blinkdot-container"); // Blinking dot
    if (!isClickInsideHeader && !isClickInsideMenu) {
      document.querySelectorAll(".submenu").forEach((submenu) => {
        submenu.style.display = "none";
        //if (dotContainer) dotContainer.style.display = "flex";
      });
      document
        .querySelectorAll(".menu-item")
        .forEach((item) => item.classList.remove("active"));

      if (dotContainer) {
        if (banner) {
          // On home page - check banner visibility
          const bannerBottom = banner.getBoundingClientRect().bottom;
          dotContainer.style.display = bannerBottom > 0 ? "flex" : "none";
        } else {
          // On other pages - always show when clicking outside menu
          if ($(".course-overview").length == 0) {
            dotContainer.style.display = "flex";
          }
        }
      }
      //overlaymenu.classList.remove('show'); // Hide overlay
      //document.body.style.overflow = ''; // Enable scroll
      //toggleBodyScroll(false); // Restore scrollbar
    }
  });
});

// Show header enroll buttton when banner is out of view
document.addEventListener("DOMContentLoaded", function () {
  const banner = document.querySelector(".home-banner");
  const enrollButton = document.querySelector(".top-enroll");
  const footerenrollButton = document.querySelector(".mobileWidgetBottom");
  const dotContainer = document.querySelector(".blinkdot-container"); // Blinking dot
  const path_name = window.location.pathname;
  if (path_name !== "/online-bba-v2") {
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
  }
});

// End of Header Code

// Start of popup functionality
const overlay = document.getElementById('overlay');
document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("show-popup")) {
    const whichpopup = e.target.getAttribute("data-showpopup");
    showPopup(whichpopup);
    // Code for MBA Download Brochure
    if (window.location.pathname.indexOf("/online-mba-courses") > -1) {
      const courseName = e.target.getAttribute("data-courseName");
      const brochureURL = e.target.getAttribute("data-brochure");
      $(".download-url").text(brochureURL);
      $("#downloadForm input[name=course_name]").val(courseName)
      if (courseName === "Master of Business Administration") {
        $("#downloadForm input[name=institution]").val("MAHE")
      } else if (courseName === "MBA-SMU") {
        $("#downloadForm input[name=institution]").val("SMU")
      } else {
        $("#downloadForm input[name=institution]").val("MUJ")
      }
    }
    //MSC courses
    if (window.location.pathname.indexOf("/online-msc-courses") > -1) {
      const courseName = e.target.getAttribute("data-courseName");
      const brochureURL = e.target.getAttribute("data-brochure");
      $(".download-url").text(brochureURL);
      $("#downloadForm input[name=course_name]").val(courseName)
      if (courseName === "MSc Business Analytics" || courseName === "MSc Data Science") {
        $("#downloadForm input[name=institution]").val("MAHE")
      }
    }

    //MSC courses
    if (window.location.pathname.indexOf("/online-mca-courses") > -1) {
      const courseName = e.target.getAttribute("data-courseName");
      const brochureURL = e.target.getAttribute("data-brochure");
      $(".download-url").text(brochureURL);
      $("#downloadForm input[name=course_name]").val(courseName)
      if (courseName === "MCA") {
        $("#downloadForm input[name=institution]").val("MUJ")
      } else if (courseName === "MCA-SMU") {
        $("#downloadForm input[name=institution]").val("SMU")
      } else {
        $("#downloadForm input[name=institution]").val("MAHE")
      }
    }
  }
});

function showPopup(whichpopup) {
  const allPopups = document.querySelectorAll(".popup");
  allPopups.forEach((popup) => {
    popup.classList.add("hidden"); // Close popup if already open
  });
  const newPopup = document.getElementById(whichpopup);
  if (newPopup) {
    newPopup.classList.remove("hidden"); // Remove the hidden class for new popup
  }
  overlay.classList.add("show"); // Use animation class
  document
    .querySelectorAll(".submenu")
    .forEach((submenu) => (submenu.style.display = "none"));
  document
    .querySelectorAll(".menu-item")
    .forEach((item) => item.classList.remove("active"));
  //$('body').addClass('overflow-hidden');
  toggleBodyScroll(true); // Restore scrollbar
}

// Hide popup
document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("close-btn")) {
    const whichpopup = e.target.parentElement.id;
    //$("header").css("position", "fixed");
    closePopup(whichpopup);
  }
});

function closePopup(whichpopup) {
  const popup = document.getElementById(whichpopup);
  overlay.classList.remove('show');
  popup.classList.add('hidden');
  toggleBodyScroll(false);
  //if (!$(".mobile-menu").hasClass("show")) {
  //$('body').removeClass('overflow-hidden');
  //}
}

overlay.addEventListener("click", () => {
  overlay.classList.remove("show");

  document.querySelectorAll(".popup").forEach((popup) => {
    popup.classList.add("hidden");
  });

  toggleBodyScroll(false); // Restore scrolling
});
// End of popup functionality

jQuery(document).ready(function ($) {

  const pathName = window.location.pathname;
  const width = $(window).width();
  const baseURL = `${window.location.protocol}//${window.location.host}/`;
  const ajaxURL = `${baseURL}wp-admin/admin-ajax.php`

  // Header mobile code
  openMobileNav = () => {
    $(".mobile-menu").toggleClass("show");
    $("body").toggleClass("overflow-hidden");
    $(".header-overlay").toggleClass("show");
    $(".top-enroll").toggleClass("hidden");

    // Toggle the hamburger menu icon
    const hamburgerIcon = $(".hamburger");
    const currentSrc = hamburgerIcon.attr("src");
    const newSrc = currentSrc.includes("ham-menu.svg")
      ? baseURL + 'wp-content/themes/flamingo/assets/images/icons/ham-close.svg'
      : baseURL + 'wp-content/themes/flamingo/assets/images/icons/ham-menu.svg';

    hamburgerIcon.attr("src", newSrc);

    // Reset to the menu-screen when opening the hamburger menu
    if ($(".mobile-menu").hasClass("show")) {
      showScreen("menu-screen"); // Reset to the first screen
    }
  }

  // Show screen function
  function showScreen(screenClass) {
    $(".screen").hide().removeClass("active");
    $(`.${screenClass}`).show().addClass("active");
    // Check if the active screen is filterSearch-screen
    if (screenClass === 'filterSearch-screen') {
      $(".header-search").hide(); // Hide the search bar
    } else {
      $(".header-search").show(); // Show the search bar for other screens
    }
  }

  // Show/hide submenu on menu item click
  $(".menu > li").on("click", function (e) {
    e.stopPropagation();
    // Close other submenus and remove active class from other li
    $(".submenu").not($(this).find(".submenu")).removeClass("active").slideUp();
    $(".menu > li").not($(this)).removeClass("active");
    // Toggle current submenu and active class on the clicked li
    const submenu = $(this).find(".submenu");
    submenu.toggleClass("active").slideToggle();
    $(this).toggleClass("active");
  });

  // Show targeted screens on submenu click
  $("[data-target]").on("click", function () {
    const targetScreen = $(this).data("target");
    showScreen(targetScreen);
  });

  // Go back to the previous screen
  $(".back-button").on("click", function () {
    const backScreen = $(this).data("back");
    showScreen(backScreen);
    $('#header-search').val('');
  });

  //Header mobile code end

  if (width <= 768) {
    $('.course-detail').hide();
  }
  //Desktop courses 
  $(document).on("click", ".footer-toggle-arrow", function () {
    $('.course-wrapper').toggle();
    $(this).toggleClass("active");
    if ($(this).hasClass("active")) {
      arrow_img = baseURL + 'wp-content/themes/flamingo/assets/images/footer-down-arrow.png';
      $(this).attr("src", arrow_img);
    } else {
      arrow_img = baseURL + 'wp-content/themes/flamingo/assets/images/footer-up-arrow.png';
      $(this).attr("src", arrow_img);
    }
  });

  // footer doodle image placement
  const containerWidth = $(".footer-get-in-touch").width();
  const leftSpace = (width - containerWidth) / 2;
  $(".footer-get-in-touch .get-in-touch .doodle").css({ "left": "-" + leftSpace + "px", "width": width + "px" });

  // impact doodle image placement
  const impactContainerWidth = $(".our-impact .container").width();
  const impactLeftSpace = (width - impactContainerWidth) / 2;
  $(".impact-animation-row").css({ "left": "-" + impactLeftSpace + "px", "width": width + "px" });

  $(".call-block").hover(function () {
    let hrefValue = $('.call-btn').attr('data-att');
    if (hrefValue) {
      $('.call-no-strip').show();
      const valueAfterColon = hrefValue.split(':')[1];
      const part1 = valueAfterColon.slice(0, 3);
      const part2 = valueAfterColon.slice(3, 8);
      const part3 = valueAfterColon.slice(8, 13);
      $('.phone-no').html('').html(`${part1} ${part2} ${part3}`);
      const blackicom = baseURL + 'wp-content/themes/flamingo/assets/images/icons/black-call-icon.png';
      $('.call-btn img').attr('src', blackicom);
      $('.call-btn img').css('width', '38px')
      // $('.call-btn img').css('margin-bottom', '-0.24vw');
    }
  }, function () {
    $('.call-no-strip').hide();
    const greyicon = baseURL + 'wp-content/themes/flamingo/assets/images/icons/grey-call-icon.png';
    $('.call-btn img').attr('src', greyicon);
    $('.call-btn img').css('width', '38px');
    $('.call-btn img').css('margin-bottom', '0');
  });

  // Auto popup code
  if ($("#auto_popup").length) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        $("#overlay").addClass("show");
        $("#auto_popup").removeClass("hidden");
      }, 15000);
    });
  }

});

//Mobile Courses
function expandCourses(num) {
  $('.expand-data-' + num).toggle();
  const element = $('.footer-accordian-' + num);
  if (element.hasClass('footer-down-arrow')) {
    element.removeClass('footer-down-arrow').addClass('footer-up-arrow');
  } else {
    element.removeClass('footer-up-arrow').addClass('footer-down-arrow');
  }
}

$(document).on("click", ".common-popup", function () {
  //$("header").css("position", "relative");
  $("header").addClass("header-hidden");
});

$(document).on("click", ".common-close-popup", function () {
  //$("header").css("position", "fixed");
  $("header").removeClass("header-hidden");
});

$(document).on("click", function (e) {
  if (!$(e.target).closest(".popup-container, .common-popup, .common-open-popup").length) {
    $("header").removeClass("header-hidden");
  }
});

// Animate doodle of each section once its visible on viewport
const sections = document.querySelectorAll('.doodle-section');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const svg = entry.target.querySelector('.doodle');
        const findCoursesvg = entry.target.querySelector('.find-course path');
        const findCourseMobilesvg = entry.target.querySelector('.mobile path');
        if (svg) {
          svg.classList.add('animate');
        }
        if (findCoursesvg) {
          findCoursesvg.classList.add('path-animate');
        }
        if (findCourseMobilesvg) {
          findCourseMobilesvg.classList.add('path-animate');
        }
      } else {
        const svg = entry.target.querySelector('.doodle');
        const findCoursesvg = entry.target.querySelector('.find-course path');
        const findCourseMobilesvg = entry.target.querySelector('.mobile path');
        if (svg) {
          svg.classList.remove('animate');
        }
        if (findCoursesvg) {
          findCoursesvg.classList.remove('path-animate');
        }
        if (findCourseMobilesvg) {
          findCourseMobilesvg.classList.remove('path-animate');
        }
      }
    });
  },
  { threshold: 0.5 } // Trigger only when the section is half visible
);

// Observe each section
sections.forEach((section) => observer.observe(section));


// testimonial read more

if (!$("body").hasClass("single-post")) {
  $(".full-des").hide();
}

$(".testimonial-desc.default.short-des").each(function () {
  var description = $(this).text();
  if (description.length > 320) {
    $(this).html(
      description.substring(0, 320) +
      '<span> ...</span><button data-showpopup="readMore_popup" class="show-popup testi-read-more" id="readMoreBtn">Read More</button>'
    );
  }
});

// Handle read more button click
$(document).on("click", ".testi-read-more", function () {
  $(".short-des").show();
  $(".full-des").hide();
});

jQuery(document).on("click", ".testi-read-more", function () {
  const sectItem = jQuery(this).parents(".testi-wrap").eq(0);
  $("#readMore_popup .image-wrapper img").attr(
    "src",
    sectItem.find(".img-wrap .testimonial-img").attr("src")
  );
  $("#readMore_popup .popup-name").html(
    sectItem.find(".name-course .name").html()
  );
  $("#readMore_popup .popup-location").html(sectItem.find(".location").html());
  $("#readMore_popup .popup-coursename").html(sectItem.find(".course").html());
  $("#readMore_popup .popup-batch").html(sectItem.find(".batch").html());
  $("#readMore_popup .popup-desc").html(
    sectItem.find(".content-wrap .testimonial-desc").html()
  );

});

const path_name = window.location.pathname;
  if (path_name == "/mahe-online-degree-courses" || path_name == "/international/online-degree-courses-v2" || path_name == "/nepal/online-degree-courses-v2" || path_name == "/online-mba" || path_name == "/online-mca") {
    $("body").addClass("marquee_there");
    const container = document.getElementsByTagName("header");
    let textElement = '';
    if (path_name == "/mahe-online-degree-courses") {
      textElement = '<span class="highlight">Avail a 15% scholarship for all Women and Corporate Employees. <span class="knowMore highlight show-popup" data-showpopup="additional_scholarship_popup"> Know More</span></span>';
    } else if(path_name == "/international/online-degree-courses-v2" || path_name == "/nepal/online-degree-courses-v2"){
      textElement = '<span><span class="highlight">10% fee </span>concession on upfront payment of full program fee  |  <span class="highlight">5% fee</span> concession on upfront payment of annual fee</span>';
    }else if(path_name == "/online-mba"){
      textElement = '<span class="highlight">Avail early bird discount of 15% on program fee</span>';
    }else if(path_name == "/online-mca"){
      textElement = '<span class="highlight">Avail early bird discount of 10% on program fee</span>';
    }
    const text = textElement;
    const space = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    let newText = "";
    for (let i = 0; i < 10; i++) {
      newText += text + space + "|" + space;
    }
    $(container).prepend('<div class="notice-text-parent"><div class="notice-text">' + newText + '</div></div>');
    let pos = 0;
    const speed = 1; // Change the speed of scrolling as needed
    let isRunning = false;
    function scrollText() {
      pos -= speed;
      $('.notice-text').css('transform', `translateX(${pos}px)`);
      if (!isRunning) {
        requestAnimationFrame(scrollText);
      }
    }
    scrollText();
    function pauseAnimation() {
      isRunning = true;
    }
    function resumeAnimation() {
      isRunning = false;
      // Start the animation loop again
      scrollText();
    }
    $(".notice-text-parent").mouseover(function () {
      pauseAnimation();
    });
    $(".notice-text-parent").mouseout(function () {
      resumeAnimation();
    });
  }


