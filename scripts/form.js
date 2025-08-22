// Set Cookie
const setCustomCookie = (key, value) => {
  var expires = new Date();
  expires.setTime(expires.getTime() + 31536000000);
  document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

// Get Cookie
const getCustomCookie = (key) => {
  var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
  return keyValue ? keyValue[2] : null;
}

jQuery(document).ready(function ($) {
  //sujects Cards hide
  $('.master-card').hide();
  $('input[name="education"]').on('click', function () {
    selectdValue = $(this).val();

    if (selectdValue == 'Bachelor Degree' || selectdValue == 'Master Degree') {
      $('.master-card').show();
      $('.managment-sub').text('MBA');
      $('.information-sub').text('MCA');
      $('.commerce-sub').text('M.Com');
      $('.arts-sub').text('English, Political Science, Sociology');
    } else {
      $('.master-card').hide();
      $('.managment-sub').text('').text('BBA');
      $('.information-sub').text('').text('BCA');
      $('.commerce-sub').text('').text('B.Com');
      $('.arts-sub').text('').text('English, Political Science, Sociology');
    }
  });

  const pathName = window.location.pathname;
  const width = $(window).width();
  const baseURL = `${window.location.protocol}//${window.location.host}/`;
  const ajaxURL = `${baseURL}wp-admin/admin-ajax.php`
  const leadForm = "#leadForm";
  const enrollForm = "#enrollForm";
  const downloadForm = "#downloadForm";
  const programLeadForm = '#programLeadForm';
  const footerLeadForm = '#footerLeadForm';
  const personalizationForm = "#personalizationForm";
  const enquiryForm = "#enquiryForm";

  // Form submission false on page load
  localStorage.setItem('formSubmitted', "No");

  // Form Submission Tracking
  const customDataLayerPush = (email, LeadFormName = '') => {
    // GTM Tracking
    dataLayer.push({ 'event': 'formSubmitted', 'formName': 'Lead Form', 'form_type': LeadFormName });
    dataLayer.push({
      'event': 'enhanced_lead', 'enhanced_conversion_data': {
        "email": email
      }
    });

    // Snapchat Tracking
    // snaptr('track', 'SIGN_UP', { 'sign_up_method': 'SIGN_UP', 'uuid_c1': '', 'user_email': email, 'user_phone_number': '', 'user_hashed_email': '', 'user_hashed_phone_number': '', 'firstname': '', 'age': '', 'lastname': '', 'geo_city': '' });

    // Sharechat Tracking
    const clickId = localStorage.getItem('clickId');
    const utm_source = localStorage.getItem('utm_source');
    if (clickId && utm_source == "sharechat") {
      const currentTimestamp = new Date().getTime();
      const adId = localStorage.getItem('adId');
      const userId = localStorage.getItem('userId');
      const utm_campaign = localStorage.getItem('utm_campaign');
      const apiTrigger = $.get("https://apis.sharechat.com/a1s-s2s-service/v1/events/manipal/post?clickId=" + clickId + "&gaid=&campaignName=" + utm_campaign + "&adId=" + adId + "&userId=" + userId + "&EventTime=" + currentTimestamp + "&eventName=registration&eventValue=1", function () { });
    }
    return true;
  }

  // FB Event Trigger
  const fbEventTrigger = (email, mobileNumer) => {
    fbq('track', 'Purchase', { currency: "INR", value: 10000.00 });
    const websiteURL = window.location.href;
    $.ajax({
      type: 'POST',
      url: '/wp-admin/admin-ajax.php',
      dataType: 'json',
      async: true,
      data: {
        action: 'fb_event_trigger',
        email: email,
        mobile_no: mobileNumer,
        website: websiteURL
      },
      success: function (res) {
      }
    });
    return true;
  }

  // Mobile number validation
  const mobileNumberValidation = (formSelector) => {
    $(document).on("input", formSelector + " input[name=mobile_number]", function () {
      this.value = this.value.replace(/\D/g, '');
    });
    const dialCode = $(formSelector + " .iti__selected-dial-code").text();
    if (dialCode == "+91") {
      $(formSelector + ' input[name=mobile_number]').attr('maxlength', '10');
    } else {
      $(formSelector + ' input[name=mobile_number]').attr('maxlength', '15');
    }
  }

  const validateEmail = (email) => {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test(email);
  }

  // Success message display
  const successDisplay = (formSelector, response) => {
    const message = response.message ? response.message : response.msg;
    $(formSelector + " #successMessage").removeClass("hidden");
    $(formSelector + " #errorMessage").addClass("hidden");
    $(formSelector + " #successMessage").fadeIn('slow');
    $(formSelector + " #successMessage").html(message);
    setTimeout(function () { $(formSelector + " #successMessage").fadeOut('slow'); }, 10000);
  }

  // Error message display
  const errorDisplay = (formSelector, response) => {
    const message = response.message ? response.message : response.msg;
    $(formSelector + " #errorMessage").removeClass("hidden");
    $(formSelector + " #successMessage").addClass("hidden");
    $(formSelector + " #errorMessage").html(message);
    $(formSelector + " #errorMessage").fadeIn('slow');
    setTimeout(function () { $(formSelector + " #errorMessage").fadeOut('slow'); }, 10000);
  }

  // Download Functionality
  const download_file = (fileURL, fileName) => {
    if (!window.ActiveXObject) {
      var save = document.createElement('a');
      save.href = fileURL;
      save.target = '_blank';
      var filename = fileURL.substring(fileURL.lastIndexOf('/') + 1);
      save.download = fileName || filename;
      if (navigator.userAgent.toLowerCase().match(/(ipad|iphone|safari)/) && navigator.userAgent.search("Chrome") < 0) {
        document.location = save.href;
      } else {
        var evt = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': false
        });
        save.dispatchEvent(evt);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
      }
    } else if (!!window.ActiveXObject && document.execCommand) {
      var _window = window.open(fileURL, '_blank');
      _window.document.close();
      _window.document.execCommand('SaveAs', true, fileName || fileURL)
      _window.close();
    }
  }

  const downloadSubmission = (formSelector) => {
    const fileURL = $(".download-url").text();
    const fileName = 'brochure.pdf';
    download_file(fileURL, fileName);
    document.getElementById("downloadForm").reset();
    $(formSelector + " .lead-submit").prop('disabled', true).text('Download Now');
    $(formSelector + " .lsq-submit").prop('disabled', true).text('Submit');
    $(formSelector + ' .form-details-block').removeClass("hidden");
    $(formSelector + ' .otp-verification-block').addClass("hidden");
    successDisplay(formSelector, { message: 'Thank you for your interest. Our counsellor will get back to you.' });
    if ($('#course_name_select').length > 0) {
      $("#course_name_select").val('').trigger('change');
    }
  }

  // OTP input functionality
  $(".otp-input").on("input", function () {
    const inputValue = $(this).val();
    const maxLength = $(this).attr("maxlength");
    if (inputValue.length >= maxLength) {
      $(this).parents(".otp-wrap").next(".otp-wrap").children(".otp-input").focus();
    }
  });
  $(".otp-input").on("keydown", function (e) {
    const key = e.key;
    if (key === "Backspace" && $(this).val() === "") {
      $(this).parents(".otp-wrap").prev(".otp-wrap").children(".otp-input").focus();
    }
  });
  // $(".otp-input").on("paste", function (e) {
  //   e.preventDefault();
  //   const pastedData = (e.originalEvent || e).clipboardData.getData("text");
  //   if (/^\d{4}$/.test(pastedData)) {
  //     $(".otp-wrap").children(".otp-input").each(function (index) {
  //       $(this).val(pastedData[index] || "");
  //     });
  //     $("#otp4").focus();
  //   }
  // });

  // Fetch site details based on program/course name
  const fetchSiteDetails = (courseName) => {
    let siteName = '';
    let app_login_url = '';
    let universityName = '';
    const MUJcourseList = ["BBA", "MBA", "BCA", "MCA", "B.Com", "M.Com", "MA.JMC", "MA in Economics"];
    const MAHEcourseList = ["MSc Data Science", "MSc Business Analytics", "PGCP Business Analytics", "PGCP Logistics and Supply Chain", "Master of Business Administration", "PGCP E&I", "PGCP Entrepreneurship and Innovation", "MCA-MAHE", "PGCP Data Science", "BBA-MAHE", "B.Com-MAHE"];
    const SMUcourseList = ["BA", "MA", "MA in English", "MA in Sociology", "MA in Political Science", "MCA-SMU", "MCOM", "BCOM", "MBA-SMU"];
    if (MUJcourseList.includes(courseName)) {
      siteName = 'MUJ';
      app_login_url = 'https://login.muj.onlinemanipal.com/';
      universityName = 'Manipal University Jaipur';
    } else if (MAHEcourseList.includes(courseName)) {
      siteName = 'MAHE';
      app_login_url = 'https://login.mahe.onlinemanipal.com/';
      universityName = 'Manipal Academy of Higher Education';
    } else if (SMUcourseList.includes(courseName)) {
      siteName = 'SMU';
      app_login_url = 'https://login.smu.onlinemanipal.com/';
      universityName = 'Sikkim Manipal University';
    }
    const output = {
      siteName,
      app_login_url,
      universityName
    }
    return output;
  }

  // Map the course name when it's same
  const courseMapping = (courseName, institutionName) => {
    if (courseName === "MBA" && (institutionName === "Manipal Academy of Higher Education" || institutionName === "MAHE")) {
      courseName = 'Master of Business Administration';
    } else if (courseName === "MCA" && (institutionName === "Manipal Academy of Higher Education" || institutionName === "MAHE")) {
      courseName = 'MCA-MAHE';
    } else if (courseName === "BBA" && (institutionName === "Manipal Academy of Higher Education" || institutionName === "MAHE")) {
      courseName = 'BBA-MAHE';
    } else if (courseName === "B.Com" && (institutionName === "Manipal Academy of Higher Education" || institutionName === "MAHE")) {
      courseName = 'B.Com-MAHE';
    } else if (courseName === "B.Com" && (institutionName === "Sikkim Manipal University" || institutionName === "SMU")) {
      courseName = 'BCOM';
    } else if (courseName === "M.Com" && (institutionName === "Sikkim Manipal University" || institutionName === "SMU")) {
      courseName = 'MCOM';
    } else if (courseName === "MCA" && (institutionName === "Sikkim Manipal University" || institutionName === "SMU")) {
      courseName = 'MCA-SMU';
    } else if (courseName === "MBA" && (institutionName === "Sikkim Manipal University" || institutionName === "SMU")) {
      courseName = 'MBA-SMU';
    }
    return courseName;
  }

  // Apply the country code dropdown to the form
  const applyCountryCode = (formSelector, countryCode = 'in') => {
    const pageType = $(".pageType").text();
    if (countryCode == 'in' && pageType !== "International") {
      window.intlTelInput(document.querySelector(formSelector + " input[name=mobile_number]"), {
        allowExtensions: false,
        autoFormat: false,
        separateDialCode: true,
        formatOnDisplay: false,
        initialCountry: 'in',
        onlyCountries: ["in"],
        utilsScript: "//cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.3/js/utils.js"
      });
    } else {
      let countryCode = $(".country-code").text();
      const countryCodeUpdate = countryCode == "in" ? 'ae' : countryCode;
      window.intlTelInput(document.querySelector(formSelector + " input[name=mobile_number]"), {
        allowExtensions: false,
        autoFormat: false,
        separateDialCode: true,
        formatOnDisplay: false,
        initialCountry: countryCodeUpdate,
        excludeCountries: ['in'],
        preferredCountries: ["ae", "us", "my", "ph"],
        utilsScript: "//cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.3/js/utils.js"
      });
    }
    mobileNumberValidation(formSelector);
  }

  // Fetch user location
  setTimeout(function () {
    jQuery.ajax({
      type: 'POST',
      url: '/wp-admin/admin-ajax.php',
      dataType: 'json',
      data: {
        action: 'get_user_location',
      },
      success: function (res) {
        const countryCode = 'in';
        if ($(leadForm + ' input[name=mobile_number]').length) { applyCountryCode(leadForm, countryCode); }
        if ($(enrollForm + ' input[name=mobile_number]').length) { applyCountryCode(enrollForm, countryCode); }
        if ($(programLeadForm + ' input[name=mobile_number]').length) { applyCountryCode(programLeadForm, countryCode); }
        if ($(footerLeadForm + ' input[name=mobile_number]').length) { applyCountryCode(footerLeadForm, countryCode); }
        if ($(downloadForm + ' input[name=mobile_number]').length) { applyCountryCode(downloadForm, countryCode); }
        if ($(enquiryForm + ' input[name=mobile_number]').length) { applyCountryCode(enquiryForm, countryCode); }
      },
      error: function (err) {
        console.log(err);
      }
    });
  }, 1000);

  // Functionality for sending OTP
  const sendOTP = (formSelector) => {
    const email = $(formSelector + " input[name=email]").val();
    const mobile_number = $(formSelector + " input[name=mobile_number]").val();
    const dialCode = $(formSelector + " .mobileBlock .iti__selected-dial-code").text();
    const otpType = dialCode != "+91" ? "Email" : "Mobile";
    let courseName = $(formSelector + " input[name=course_name]").val();
    if (!courseName) { courseName = $(formSelector + " select[name=course_name]").val(); }
    let institutionName = $(formSelector + " input[name=institution]").val();
    if (!institutionName) { institutionName = $(formSelector + " select[name=institution]").val(); }
    courseName = courseMapping(courseName, institutionName);
    const siteDetails = fetchSiteDetails(courseName);
    const siteName = siteDetails.siteName;
    const formattedNumber = dialCode + '-' + mobile_number;
    const payload = {
      email: email,
      mobileNumber: mobile_number,
      countryCode: dialCode,
      siteName: siteName,
      otpType: otpType
    }
    fetch('/wp-json/api/v1/generate-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'a0487082-9247-42dd-80dc-2330501f3c7c'
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 1) {
          $(formSelector + " .lsq-submit").prop("disabled", true);
          $(formSelector + " .form-details-block").addClass("hidden");
          $(formSelector + " .otp-verification-block").removeClass("hidden");
          enableResendOTP(formSelector);
          dialCode != "+91" ? $(formSelector + ' .otpNumber').text(email) : $(formSelector + ' .otpNumber').text(formattedNumber);
        }
      })
      .catch(error => { $(formSelector + ' #errorMessage').html(error); });
  }

  // Timer count down
  const timerCountdown = () => {
    let timer2 = "0:30";
    let interval = setInterval(function () {
      let timer = timer2.split(':');
      let minutes = parseInt(timer[0], 10);
      let seconds = parseInt(timer[1], 10);
      --seconds;
      minutes = (seconds < 0) ? --minutes : minutes;
      if (minutes < 0) clearInterval(interval);
      seconds = (seconds < 0) ? 30 : seconds;
      seconds = (seconds < 10) ? '0' + seconds : seconds;
      $('.countdown').html(seconds);
      timer2 = minutes + ':' + seconds;
    }, 1000);
    return true;
  }

  $(document).on("click", leadForm + " #resendOtpBtn", function (e) {
    e.preventDefault();
    sendOTP(leadForm);
  });

  $(document).on("click", enrollForm + " #resendOtpBtn", function (e) {
    e.preventDefault();
    sendOTP(enrollForm);
  });

  $(document).on("click", programLeadForm + " #resendOtpBtn", function (e) {
    e.preventDefault();
    sendOTP(programLeadForm);
  });

  $(document).on("click", footerLeadForm + " #resendOtpBtn", function (e) {
    e.preventDefault();
    sendOTP(footerLeadForm);
  });

  $(document).on("click", downloadForm + " #resendOtpBtn", function (e) {
    e.preventDefault();
    sendOTP(downloadForm);
  });

  $(document).on("click", enquiryForm + " #resendOtpBtn", function (e) {
    e.preventDefault();
    sendOTP(enquiryForm);
  });

  const enableResendOTP = (formSelector) => {
    $(formSelector + " .resend-otp").attr("disabled", "disabled");
    timerCountdown();
    setTimeout(function () {
      $(formSelector + " .resend-otp").removeAttr("disabled");
    }, 30000);
  }

  // Functionality for verify OTP
  const verifyOTP = (formSelector, type = 'Mobile') => {
    const digit1 = $(formSelector + " .otp-wrap input[name=otp1]").val();
    const digit2 = $(formSelector + " .otp-wrap input[name=otp2]").val();
    const digit3 = $(formSelector + " .otp-wrap input[name=otp3]").val();
    const digit4 = $(formSelector + " .otp-wrap input[name=otp4]").val();
    const otp = digit1 + digit2 + digit3 + digit4;
    if (otp.length == 4) {
      const mobile_number = $(formSelector + ' input[name="mobile_number"]').val();
      const email = $(formSelector + ' input[name="email"]').val();
      const dialCode = $(formSelector + " .mobileBlock .iti__selected-dial-code").text();
      const type = dialCode != "+91" ? "Email" : "Mobile";
      const payload = {
        type: type,
        email: email,
        dial_code: dialCode,
        mobileNumber: mobile_number,
        otp: otp
      }
      fetch('/wp-json/api/v1/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'a0487082-9247-42dd-80dc-2330501f3c7c'
        },
        body: JSON.stringify(payload),
      })
        .then(response => response.json())
        .then(data => {
          if (data.status == 1) {
            $(formSelector + " .otp-field").addClass("success");
            $(formSelector + " .otp-field").removeClass("error");
            $(formSelector + " .lsq-submit").prop("disabled", false);
            $(formSelector + " .lsq-submit").text("Submit");
          } else {
            $(formSelector + " .otp-field").addClass("error");
            $(formSelector + " .otp-field").removeClass("success");
            $(formSelector + " .lsq-submit").prop("disabled", true);
            $(formSelector + " .lsq-submit").text("Verify");
          }
        })
        .catch(error => {
          alert("An error occurred. Please try again.");
        });
    }
  }

  let timeout;
  $(document).on("keyup input paste", leadForm + " .otp-field input", function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => { verifyOTP(leadForm); }, 300);
  });

  $(document).on("keyup input paste", enrollForm + " .otp-field input", function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => { verifyOTP(enrollForm); }, 300);
  });

  $(document).on("keyup input paste", programLeadForm + " .otp-field input", function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => { verifyOTP(programLeadForm); }, 300);
  });

  $(document).on("keyup input paste", footerLeadForm + " .otp-field input", function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => { verifyOTP(footerLeadForm); }, 300);
  });

  $(document).on("keyup input paste", downloadForm + " .otp-field input", function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => { verifyOTP(downloadForm); }, 300);
  });

  $(document).on("keyup input paste", enquiryForm + " .otp-field input", function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => { verifyOTP(enquiryForm); }, 300);
  });

  // Functionality for lead form submission
  const leadFormSubmission = (formSelector) => {
    $(formSelector).validate({
      rules: {
        name: { required: true },
        email: { required: true, email: true },
        mobile_number: { required: true },
        course_name: { required: true },
        institution: { required: true }
      },
      messages: {
        name: { required: "Please enter your name" },
        email: { required: "Please enter your email", email: "Please enter the valid email" },
        mobile_number: { required: "Please enter your mobile number" },
        course_name: { required: "Please select the course name" },
        institution: { required: "Please select the institution" }
      }
    });
    $(document).on("click", formSelector + " .lead-submit", function (e) {
      e.preventDefault();
      const honeypot = $(formSelector + ' input[name="honeypot"]').val();
      if (honeypot) { return false };
      if ($(formSelector).valid()) {
        $(this).prop('disabled', true).text('Processing...');
        const name = $(formSelector + " input[name=name]").val();
        const email = $(formSelector + " input[name=email]").val();
        const number = $(formSelector + " input[name=mobile_number]").val();
        const dialCode = $(formSelector + " .iti__selected-dial-code").text();
        const mobile_number = dialCode + '-' + number;
        let courseName = $(formSelector + " input[name=course_name]").val() ? $(formSelector + " input[name=course_name]").val() : $(formSelector + " select[name=course_name]").val();
        const institutionName = $(formSelector + " input[name=institution]").val() ? $(formSelector + " input[name=institution]").val() : $(formSelector + " select[name=institution]").val();
        courseName = courseMapping(courseName, institutionName);
        const siteDetails = fetchSiteDetails(courseName);
        const siteName = siteDetails.siteName;
        const app_login_url = siteDetails.app_login_url;
        const formType = dialCode == "+91" ? 'Domestic Application Form' : 'International Application Form';
        let mx_Category = '';
        if (siteName === "MAHE") { mx_Category = dialCode == "+91" ? "Indian" : "Foreign & NRI"; }
        const source = $(formSelector + " input[name=leadsquared-Source]").val();
        const utmCampaign = $(formSelector + " input[name=leadsquared-SourceCampaign]").val();
        const utmMedium = $(formSelector + " input[name=leadsquared-SourceMedium]").val();
        const utmContent = $(formSelector + " input[name=leadsquared-SourceContent]").val();
        const utmKeyword = $(formSelector + " input[name=leadsquared-mx_UTM_Keyword]").val();
        const utmAdset = $(formSelector + " input[name=leadsquared-mx_Marketing_Ad_Set]").val();
        const Adset_id = $(formSelector + " input[name=leadsquared-Adset_id]").val();
        const utmMatchType = $(formSelector + " input[name='leadsquared-mx_UTM_Matchtype']").val();
        const utmPlacement = $(formSelector + " input[name='leadsquared-mx_UTM_Placement']").val();
        const utmPosition = $(formSelector + " input[name='leadsquared-mx_UTM_Position']").val();
        const device = $(formSelector + " input[name=leadsquared-mx_Device]").val();
        const website = $(formSelector + " input[name=leadsquared-Website]").val();
        const location = $(formSelector + " input[name=leadsquared-mx_Location]").val();
        const ip_address = $(formSelector + " input[name=leadsquared-mx_Website_IP_Address]").val();
        const mx_mobile = $(formSelector + " input[name=leadsquared-mx_mobile]").val();
        const agentMedium = $(formSelector + " input[name='leadsquared-mx_Lead_Medium']").val();
        const gclid = $(formSelector + " input[name='leadsquared-mx_gclid']").val();
        const workExperience = $(formSelector + " select[name=leadsquared-mx_Student_Experience]").val();
        const token = $(formSelector + " #sub-token").val();
        const referer_url = $(formSelector + " input[name=referer_url]").val();
        const LeadFormName = $(formSelector + " input[name=LeadFormName]").val();
        const userCountry = $(formSelector + " input[name=userCountry]").val();
        $.ajax({
          url: ajaxURL,
          type: 'POST',
          dataType: 'json',
          data: {
            action: 'lead_form_submit',
            email: email,
            first_name: name,
            dialCode: dialCode,
            mobile_number: mobile_number,
            number: number,
            utm_source: source,
            utm_campaign: utmCampaign,
            utm_medium: utmMedium,
            utm_content: utmContent,
            utm_keyword: utmKeyword,
            utm_adset: utmAdset,
            Adset_id: Adset_id,
            utmMatchType: utmMatchType,
            utmPlacement: utmPlacement,
            utmPosition: utmPosition,
            device: device,
            website: website,
            location: location,
            ip_address: ip_address,
            course_name: courseName,
            site_name: siteName,
            mx_Category: mx_Category,
            formType: formType,
            agentMedium: agentMedium,
            gclid: gclid,
            workExperience: workExperience,
            token: token,
            referer_url: referer_url,
            LeadFormName: LeadFormName,
            userCountry: userCountry,
            institutionName: institutionName,
            mx_mobile: mx_mobile
          },
          success: function (response) {
            customDataLayerPush(email, LeadFormName);
            fbEventTrigger(email, mobile_number);
            $(formSelector + ' .lead-submit').prop('disabled', false).text('Submit');
            if (response.status === 1) {
              if (response.status === 1 && (response.message === "Success" || response.msg === "Success")) {
                const prospectId = response.data.Message.RelatedId;
                localStorage.setItem('formSubmitted', "Yes");
                localStorage.setItem('prospectId', prospectId);
                localStorage.setItem('leadID', prospectId);
                sendOTP(formSelector);
                formSelector !== downloadForm && LSQSubmission(formSelector, e);
              } else if (formSelector === downloadForm) {
                downloadSubmission(formSelector);
              } else if (formSelector === enquiryForm) {
                const fileURL = $(".download-url").text();
                enquirySubmission(formSelector, app_login_url, fileURL);
              } else {
                errorDisplay(formSelector, response)
              }
            } else {
              errorDisplay(formSelector, response)
            }
          },
          error: function () {
            $(formSelector + ' .lead-submit').prop('disabled', false).text('Submit');
            errorDisplay(formSelector, response)
          }
        });
      }
    });
  }

  if ($(leadForm).length) { leadFormSubmission(leadForm); }
  if ($(enrollForm).length) { leadFormSubmission(enrollForm); }
  if ($(programLeadForm).length) { leadFormSubmission(programLeadForm); }
  if ($(footerLeadForm).length) { leadFormSubmission(footerLeadForm); }
  if ($(downloadForm).length) { leadFormSubmission(downloadForm); }
  if ($(enquiryForm).length) { leadFormSubmission(enquiryForm); }

  // Final submission to LSQ portal
  const LSQSubmission = (formSelector, e) => {
    let fetchLoginURL = $("#lsq-login-url").text();
    let formSubmitted = localStorage.getItem('formSubmitted');
    if (!fetchLoginURL) { fetchLoginURL = localStorage.getItem('loginURL'); }
    if (formSelector === downloadForm) {
      $(formSelector + " .lsq-submit").prop('disabled', true).text('Downloading...');
    }
    if (fetchLoginURL) {
      localStorage.setItem('loginURL', "");
      if (formSelector === enquiryForm) {
        const fileURL = $(".download-url").text();
        enquirySubmission(formSelector, fetchLoginURL, fileURL);
      } else {
        window.location.href = fetchLoginURL;
      }
    } else if (formSubmitted === "Yes") {
      let leadID = localStorage.getItem('leadID');
      const email = $(formSelector + " input[name=email]").val();
      const number = $(formSelector + " input[name=mobile_number]").val();
      const dialCode = $(formSelector + " .iti__selected-dial-code").text();
      const mobileNumber = dialCode + '-' + number;
      let courseName = $(formSelector + " input[name=course_name]").val() ? $(formSelector + " input[name=course_name]").val() : $(formSelector + " select[name=course_name]").val();
      const institutionName = $(formSelector + " input[name=institution]").val() ? $(formSelector + " input[name=institution]").val() : $(formSelector + " select[name=institution]").val();
      courseName = courseMapping(courseName, institutionName);
      const siteDetails = fetchSiteDetails(courseName);
      const siteName = siteDetails.siteName;
      $.ajax({
        type: 'POST',
        url: '/wp-admin/admin-ajax.php',
        dataType: 'json',
        data: {
          action: 'lsq_submit_data',
          email: email,
          site_name: siteName,
          mobile_number: mobileNumber,
          ProspectID: leadID,
        },
        success: function (response) {
          localStorage.setItem('formSubmitted', "");
          localStorage.setItem('leadID', "");
          if (formSelector === downloadForm) {
            downloadSubmission(formSelector);
          } else {
            let loginURL = response.login_url;
            if (loginURL) {
              localStorage.setItem('loginURL', loginURL);
              $("#lsq-login-url").text(loginURL);
            } else {
              $(formSelector + " .lsq-submit").prop("disabled", true);
            }
          }
        }
      });
    }
  }

  $(document).on("click", leadForm + " .lsq-submit", function (e) { e.preventDefault(); LSQSubmission(leadForm, e); });
  $(document).on("click", enrollForm + " .lsq-submit", function (e) { e.preventDefault(); LSQSubmission(enrollForm, e); });
  $(document).on("click", programLeadForm + " .lsq-submit", function (e) { e.preventDefault(); LSQSubmission(programLeadForm, e); });
  $(document).on("click", footerLeadForm + " .lsq-submit", function (e) { e.preventDefault(); LSQSubmission(footerLeadForm, e); });
  $(document).on("click", downloadForm + " .lsq-submit", function (e) { e.preventDefault(); LSQSubmission(downloadForm, e); });
  $(document).on("click", enquiryForm + " .lsq-submit", function (e) { e.preventDefault(); LSQSubmission(enquiryForm, e); });

  // Override dropdown styling
  $('select').each(function () {
    $(this).select2({
      dropdownParent: $(this).parent(),
      placeholder: $(this).data('placeholder'),
      minimumResultsForSearch: 50,
    });
    $(this).one('select2:open', function (e) {
      $('input.select2-search__field').prop('placeholder', 'Search here...');
    });
    $(this).on('select2:open', function (e) {
      $('.select2-container--open .select2-selection__arrow').addClass("up_arrow");
    });
    $(this).on('select2:close', function (e) {
      $('.select2-selection__arrow').removeClass("up_arrow");
    });
  });

  const isNumeric = (value) => {
    return !isNaN(value) && !isNaN(parseFloat(value));
  }

  // Disable the submit button until all the fields are filled
  const checkFormFields = (formSelector) => {
    const submitButton = $(formSelector + ' .lead-submit');
    const name = $(formSelector + " input[name=name]").val();
    const email = $(formSelector + " input[name=email]").val();
    const dialCode = $(formSelector + " .mobileBlock .iti__selected-dial-code").text();
    const number = $(formSelector + " input[name=mobile_number]").val().trim();
    const courseName = $(formSelector + " input[name=course_name]").val() ? $(formSelector + " input[name=course_name]").val() : $(formSelector + " select[name=course_name]").val();;
    const institutionName = $(formSelector + " input[name=institution]").val() ? $(formSelector + " input[name=institution]").val() : $(formSelector + " select[name=institution]").val();
    const termCondition = $(formSelector + " .terms-condition input").prop('checked') == true ? 'Yes' : 'No';
    let mobileNumberValidation = false;
    if (dialCode === "+91") {
      mobileNumberValidation = number.length === 10 ? true : false;
    } else {
      mobileNumberValidation = true;
    }
    if (name && email && validateEmail(email) && number && mobileNumberValidation && isNumeric(number) && courseName && institutionName && termCondition === "Yes") {
      submitButton.prop('disabled', false);
    } else {
      submitButton.prop('disabled', true);
    }
  }

  const formValidation = (formSelector) => {
    $(formSelector + " .institutionName select").prop("disabled", true);
    const submitButton = $(formSelector + ' .lead-submit');
    submitButton.prop('disabled', true);
    const requiredFields = [
      formSelector + " input[name=name]",
      formSelector + " input[name=email]",
      formSelector + " input[name=mobile_number]",
      formSelector + " .courseName select",
      formSelector + " .institutionName select",
      formSelector + " .terms-condition input",
      formSelector + " select.courseName",
    ];
    requiredFields.forEach((selector) => {
      $(selector).on('change input', function () {
        checkFormFields(formSelector);
      });
    });
  }

  const universitySelection = (formSelector) => {
    $(document).on("change", formSelector + " select[name=course_name]", function () {
      const selVal = $(this).val();
      if (selVal) {
        $(formSelector + " .institutionName select").prop("disabled", false);
        const institutionSelector = $(formSelector + " select[name=institution]");
        $(institutionSelector).empty();
        const siteDetails = fetchSiteDetails(selVal);
        const institutionName = siteDetails.universityName;
        const institutionShortName = siteDetails.siteName;
        let MUJSMUCourses = ["MCA", "B.Com", "M.Com"];
        let MUJMAHECourses = ["BBA"];
        let newOptions = [];
        let selectUniversity = 'No';
        if (selVal == "MBA" || selVal == "MCA" || selVal == "B.Com") {
          newOptions = [
            { id: '', text: 'Select Institution*' },
            { id: 'MUJ', text: 'Manipal University Jaipur' },
            { id: 'MAHE', text: 'Manipal Academy of Higher Education' },
            { id: 'SMU', text: 'Sikkim Manipal University' }
          ];
        } else if (MUJMAHECourses.includes(selVal)) {
          newOptions = [
            { id: '', text: 'Select Institution*' },
            { id: 'MUJ', text: 'Manipal University Jaipur' },
            { id: 'MAHE', text: 'Manipal Academy of Higher Education' }
          ];
        } else if (MUJSMUCourses.includes(selVal)) {
          newOptions = [
            { id: '', text: 'Select Institution*' },
            { id: 'MUJ', text: 'Manipal University Jaipur' },
            { id: 'SMU', text: 'Sikkim Manipal University' }
          ];
        } else {
          newOptions = [
            { id: '', text: 'Select Institution*' },
            { id: institutionShortName, text: institutionName }
          ];
          selectUniversity = 'Yes';
        }
        newOptions.forEach(option => {
          const newOption = new Option(option.text, option.id, false, false);
          $(institutionSelector).append(newOption);
        });
        $(institutionSelector).trigger('change');
        selectUniversity === 'Yes' && $(institutionSelector).val(institutionShortName).trigger('change');
      }
    });
  }

  if (leadForm.length) { formValidation(leadForm); universitySelection(leadForm); }
  if (enrollForm.length) { formValidation(enrollForm); universitySelection(enrollForm); }
  if (programLeadForm.length) { formValidation(programLeadForm); }
  if (footerLeadForm.length) { formValidation(footerLeadForm); universitySelection(footerLeadForm); }
  if (downloadForm.length) { formValidation(downloadForm); }
  if (enquiryForm.length) { formValidation(enquiryForm); universitySelection(enquiryForm); }

  const switchScreen = (formSelector) => {
    $(formSelector + " .form-details-block").removeClass("hidden");
    $(formSelector + " .otp-verification-block").addClass("hidden");
  }

  $(document).on("click", leadForm + " .editLink", function () { switchScreen(leadForm); });
  $(document).on("click", enrollForm + " .editLink", function () { switchScreen(enrollForm); });
  $(document).on("click", programLeadForm + " .editLink", function () { switchScreen(programLeadForm); });
  $(document).on("click", footerLeadForm + " .editLink", function () { switchScreen(footerLeadForm); });
  $(document).on("click", downloadForm + " .editLink", function () { switchScreen(downloadForm); });
  $(document).on("click", enquiryForm + " .editLink", function () { switchScreen(enquiryForm); });

  // Find my course popup functionality
  const body = document.body;
  if (body.classList.contains('page-template-home') || body.classList.contains('page-template-program-listing') || body.classList.contains('page-template-program-specializations-listing')) {
    // Function to check if all required fields in the current section are filled
    function validateSection(sectionId) {

      let isValid = true;
      // Iterate through all visible <select> elements inside the section
      $(`#${sectionId} select:visible`).each(function () {
        if (!$(this).val()) {
          isValid = false;
          return false; // Stop checking further if one invalid field is found
        }
      });

      return isValid;

    }
    // Function to toggle buttons based on validation
    function toggleButton(sectionId, buttonId) {
      const isSectionValid = validateSection(sectionId);
      $(`#${buttonId}`).prop("disabled", !isSectionValid);
    }
    // Event listener for changes in dropdown fields
    $(document).on("change", "#courseForm select", function () {
      const parentSection = $(this).closest(".form-section").attr("id");
      // Toggle the button based on the section
      if (parentSection === "section1") {
        toggleButton("section1", "find-course");
      }
    });
    // Initial validation check for each section
    toggleButton("section1", "nextBtn");
    toggleButton("section2", "findCourseBtn");

    $("#institution_field, #duration, #domain").on("select2:selecting", function (e) {
      $(this).select2("close");
    });
  }

  // Start of Personalization Functionality
  $(document).on("click", personalizationForm + " .move-forward", function (e) {
    e.preventDefault();

    const currentBlock = $(this).parents(".formBlock").attr("id");
    const nextBlock = $(this).parents(".formBlock").next(".formBlock").attr("id");

    // Education step
    if (currentBlock === "getStarted" || currentBlock === "education") {
      $("#" + currentBlock).addClass("hidden");
      $("#" + nextBlock).removeClass("hidden");
      $(".progress-bar").show();
    }
    if (currentBlock === "getStarted") {
      $(".progress-bar").removeClass("hidden");
    } else if (currentBlock === "education") {
      $(".progress-bar .moving-bar").css("width", "66.66%");
      $(".moving-bar").text('').text('2/3');

    }
    // interested in step
    if (currentBlock === "interestedField") {
      const interestedInFields = document.querySelectorAll("#" + currentBlock + " input[type='checkbox']");
      const interestedFieldChecked = Array.from(interestedInFields).some(interestedInFields => interestedInFields.checked);
      if (!interestedFieldChecked) {
        alert("Please select at least one option.");
      } else {
        $("#" + currentBlock).addClass("hidden");
        $("#" + nextBlock).removeClass("hidden");
        $(".progress-bar .moving-bar").css("width", "100%");
        $(".moving-bar").text('').text('3/3');
      }
    }
    // blog category in step
    if (currentBlock === "blogCategory") {
      const interestedInFields = document.querySelectorAll("#" + currentBlock + " input[type='checkbox']");
      const blogCategoryChecked = Array.from(interestedInFields).some(interestedInFields => interestedInFields.checked);
      if (!blogCategoryChecked) {
        alert("Please select at least one option.");
      } else {
        $("#" + currentBlock).addClass("hidden");
        $("#" + nextBlock).removeClass("hidden");
      }
    }
    $("#prevStep").attr("data-back-step", currentBlock);
    currentBlock === "getStarted" ? $("#prevStep").removeClass("hidden") : currentBlock === "blogCategory" ? $("#prevStep").addClass("hidden") : null;
    // setTimeout(function () {
    //   $(".header").addClass("header-hidden");
    // }, 200);
  });

  // Back button
  $(document).on("click", ".back-btn", function (e) {
    e.preventDefault();
    const currentValue = $(this).attr("data-back-step");

    if (currentValue === "getStarted") {
      $(".progress-bar").hide();
    }
    if (currentValue === "education") {
      $(".moving-bar").text('').text('1/3');
      $(".progress-bar .moving-bar").css("width", "33.33%");
    }
    if (currentValue === "interestedField") {
      $(".moving-bar").text('').text('2/3');
      $(".progress-bar .moving-bar").css("width", "66.66%");
    }
    const prevBlock = $("#" + currentValue + ".formBlock").prev(".formBlock").attr("id");
    $(this).attr("data-back-step", prevBlock);
    prevBlock === undefined ? $(this).addClass("hidden") : null;
    $(personalizationForm + ' .formBlock').each(function () {
      !$(this).hasClass("hidden") ? ($(this).addClass("hidden"), $("#" + currentValue).removeClass("hidden")) : null;
    });
  });

  // Build personalization page url
  $(document).on("click", personalizationForm + " .final-submit", function (e) {
    document.body.style.overflow = "";
    e.preventDefault();
    const interestedInFields = document.querySelectorAll("#blogCategory input[type='checkbox']");
    const blogCategoryChecked = Array.from(interestedInFields).some(interestedInFields => interestedInFields.checked);
    if (!blogCategoryChecked) {
      alert("Please select at least one option.");
    } else {
      $("#blogCategory").addClass("hidden");
      $("#loading-screen").removeClass("hidden");
      $(".progress-bar").addClass("hidden");
      const education = $('input[name="education"]:checked').val();
      const interestedIn = [];
      $('input[name="interested"]:checked').each(function (i) {
        interestedIn[i] = $(this).val();
      });

      let selectedCategories = []
      $('input[name="categories[]"]:checked').each(function (i) {
        selectedCategories[i] = $(this).val();
      });
      // Course cards filter
      let presonalizationData = '';
      presonalizationData = {
        "personalization_mode": "active",
        "education": education,
        "interested_in": interestedIn,
        "blog_categories": selectedCategories
      };
      localStorage.setItem('presonalizationData', JSON.stringify(presonalizationData));
      personalizationFilter('popupformsubmit');
    }
  });

  // Exit personalization filter
  $(document).on("click", " .exit", function (e) {
    localStorage.removeItem("presonalizationData");
    window.location.reload();
  });

  // Edit personalization filter
  $(document).on("click", " .edit", function (e) {
    $("#personalizationForm .formBlock").addClass("hidden");
    $("#personalizationForm #education.formBlock").removeClass("hidden");
    $("#prevStep").removeClass("hidden");
    $("#prevStep").attr("data-back-step", "getStarted");
    //personalizationFilter('dataEdit');
  });
  personalizationFilter();

  const passingUTMParameters = (domainName) => {
    $('a').each(function () {
      const text = $(this).attr("href");
      if (text && text.indexOf(domainName) != -1) {
        const utmParam = localStorage.getItem('utm_parameters');
        $(this).attr("href", $(this).attr("href") + utmParam);
      }
    });
  }

  // Passing utm sources to enrol now url
  const search = window.location.search;
  const searchString = 'utm_source';
  if (search && search.indexOf(searchString) != -1) {
    localStorage.setItem('utm_parameters', search);
    passingUTMParameters("mahe.onlinemanipal.com");
    passingUTMParameters("smu.onlinemanipal.com");
    passingUTMParameters("muj.onlinemanipal.com");
  } else {
    const utmParam = localStorage.getItem('utm_parameters');
    if (utmParam && utmParam.indexOf(searchString) != -1) {
      localStorage.setItem('utm_parameters', utmParam);
      passingUTMParameters("mahe.onlinemanipal.com");
      passingUTMParameters("smu.onlinemanipal.com");
      passingUTMParameters("muj.onlinemanipal.com");
    }
  }

  // Passing hidden values to LSQ form
  let deviceType = 'Desktop';
  deviceType = width < 480 ? "Mobile" : width < 768 ? "Tablet" : "Desktop";
  const sourceLocation = $(".source-location").text();
  const sourceIPAddress = $(".source-ip-address").text();
  const websitePath = window.location.href;
  $("input[name='leadsquared-mx_Location']").val(sourceLocation);
  $("input[name='leadsquared-mx_Device']").val(deviceType);
  $("input[name='leadsquared-mx_Website_IP_Address']").val(sourceIPAddress);
  $("input[name='leadsquared-Website']").val(websitePath);

  const append_referer_url = () => {
    const referer_url = document.referrer || window.location.href; $("<input>", { type: "hidden", name: "referer_url", value: referer_url }).appendTo("form");
  }
  append_referer_url();

  const enquirySubmission = (formSelector, app_login_url, brochure_url) => {
    $(formSelector + " .otp-verification-block").hide();
    $(formSelector + " .form-details-block").hide();
    $(formSelector + " .enquiry-block").show();
    const thankyouMsg = brochure_url ? '<p>Thank you for your interest. Our counsellor will get back to you.</p><div class="btns"><a href="' + app_login_url + '" class="btn primaryBtn">Start Your Application</a><a href="' + brochure_url + '" class="btn primaryBtn">Download Brochure</a></div>' : '<p>Thank you for your interest. Our counsellor will get back to you.</p><div class="btns"><a href="' + app_login_url + '" class="btn primaryBtn">Start Your Application</a></div>';
    $(formSelector + " .enquiry-block").html(thankyouMsg);
  }

  // LP Course Selection Functionality
  const lpCourseSelection = (formSelector) => {
    $(document).on("change", formSelector + " select[name=course_name]", function () {
      var selectedValue = $(this).val().trim();
      const courseDetails = fetchSiteDetails(selectedValue);
      courseDetails.universityName && $(formSelector + ' input[name="institution"]').val(courseDetails.universityName);
      checkFormFields(formSelector);
    });
  }

  const allowedPaths = [
    "/mahe-online-degree-courses-v2",
    "/mahe-online-degree-courses",
    "/muj-online-degree-courses",
    "/smu-online-degree-courses",
    "/online-degree-courses",
    "/online-masters-degrees",
    "/online-bachelors-degree-courses",
    "/international/online-degree-courses",
    "/nepal/online-degree-courses",
    "/international/online-degree-courses-v2"
  ];

  if (allowedPaths.includes(pathName)) {
    $(leadForm).length && lpCourseSelection(leadForm);
    $(footerLeadForm).length && lpCourseSelection(footerLeadForm);
    $(programLeadForm).length && lpCourseSelection(programLeadForm);
  }

});

function scrollToDiv() {
  var target = $(".top-action-bar");
  if (target.length) {
    $("html,body").animate(
      {
        scrollTop: target.offset().top - 200,
      },
      1000
    );
    return false;
  }
}

// common function for personalization popup
function personalizationPopup_utilities() {
  setTimeout(function () {
    $("#personalizationForm_popup").addClass("hidden");
    $("#loading-screen").addClass("hidden");
    $("#education").removeClass("hidden");
    $("#overlay").removeClass("show");
    $("body").removeClass("overflow-hidden");
    $("header").removeClass("header-hidden");
  }, 3000);
  scrollToDiv();
}

function personalizationResultUtilities() {
  const headerHeight = $("header").outerHeight();
  const bannerHeight = $(".home-banner").outerHeight();
  $("body").addClass("personalized-result");
  $(".top-action-bar").removeClass("hidden");
  const topActionBar = $(".top-action-bar").outerHeight();
  $(".top-action-bar").css("top", headerHeight);
}

function personalizationHideSections() {
  $(".find-right-course .left, .find-right-course .right, .find-right-course .view-all-btn, .choose-course, .personalization-btn").addClass("hidden");
  $(".demand-specialization").addClass("hidden");
  $(".top-section .view-all-btn").removeClass("hidden");
}

function personalizationFilter(dataPara = '') {
  var parameterEdit = dataPara;
  const presonalizationData = JSON.parse(localStorage.getItem("presonalizationData"));
  $('.submenu .tab-btn').removeClass('active');
  $('.content-area .tab-panel').removeClass('active');
  if (presonalizationData) {

    if (presonalizationData.education == 'High School Graduate') {
      const menuBachelor = document.querySelector('[data-tab="section1-bachelor"]');
      $('#section1-bachelor').addClass('active');
      if (menuBachelor) {
        menuBachelor.classList.toggle("active");
      }
    } else if (presonalizationData.education == 'Bachelor Degree' || presonalizationData.education == 'Master Degree') {
      const menuMaster = document.querySelector('[data-tab="section1-master"]');
      $('#section1-master').addClass('active');
      if (menuMaster) {
        menuMaster.classList.toggle("active");
      }
    }

    const education = presonalizationData.education;
    const interestedIn = presonalizationData.interested_in;
    const blog_categories = presonalizationData.blog_categories;
    var urlpage = window.location.pathname;

    var personalizationCourses = localStorage.getItem("personalizationCourses");
    var personalizationBlogs = localStorage.getItem("personalizationBlogs");

    if (personalizationCourses) {
      var tempPersonalizationCourses = document.createElement('div');
      tempPersonalizationCourses.innerHTML = personalizationCourses;

      var courseCount = tempPersonalizationCourses.querySelectorAll('.line-item').length;

      setTimeout(function () {
        if (courseCount <= 4) {
          $(".top-course-slider .slick-dots").css("display", "none");
        } else {
          $(".top-course-slider .slick-dots").css("display", "block");
        }
      }, 100);
    }

    if (!personalizationCourses) {
      fetchBlogandCourses(education, interestedIn, blog_categories, urlpage);
    } else if (parameterEdit == 'popupformsubmit' && personalizationCourses !== null) {
      fetchBlogandCourses(education, interestedIn, blog_categories, urlpage);
    } else {
      //Courses
      var personalizationCourseCookie = decodeURIComponent(personalizationCourses || '');
      $(".courses-slider").replaceWith(personalizationCourseCookie);
      personalizationResultUtilities();
      if ($(".top-course-slider").length) {
        setTimeout(function () {
          topOnlineCourseSliderInitialize();
        }, 500);
      }

      //Blogs
      var personalizationBlogCookie = decodeURIComponent(personalizationBlogs || '');
      $(".top-read-blog-slider").replaceWith(personalizationBlogCookie);
      personalizationResultUtilities();
      if ($(".top-read-blog-slider").length) {
        setTimeout(function () {
          blogSliderInitialize(true);
        }, 100);
      }
      personalizationHideSections();
      scrollToDiv();
    }
  } else {
    const menuMaster = document.querySelector('[data-tab="section1-master"]');
    $('#section1-master').addClass('active');
    if (menuMaster) {
      menuMaster.classList.toggle("active");
    }
  }
}

function fetchBlogandCourses(education, interestedIn, blog_categories, urlpage) {
  $.ajax({
    url: "/wp-admin/admin-ajax.php",
    type: "POST",
    dataType: "html",
    data: {
      action: "personalize_courses",
      education: education,
      interestedIn: interestedIn,
      url: urlpage,
    },
    success: function (response) {
      personalizationPopup_utilities();
      $(".top-online-course .section-title").text("Courses for you");
      $(".universities-section .section-title").text("Get a degree from our 3 esteemed universities");
      if (!response || $.trim(response) === "") {
        $(".top-online-course").css("margin-bottom", "0");
        $(".top-course-slider").html("No result found.");
        $("body").removeClass("overflow-hidden");
        personalizationPopup_utilities();
        personalizationResultUtilities();
        personalizationHideSections();
      } else {
        $(".courses-slider").replaceWith(response);
        localStorage.removeItem('personalizationCourses');
        localStorage.setItem('personalizationCourses', response);
        personalizationResultUtilities();
        if ($(".top-course-slider").length) {
          setTimeout(function () {
            topOnlineCourseSliderInitialize();
          }, 500);
        }
        personalizationHideSections();
      }
      cardlenght = $('.top-course-slider .line-item').length;
      const resolution = $(window).width()
      if (resolution <= 768) {
        cardshow = 1;
      } else {
        cardshow = 4;
      }
      setTimeout(() => {
        if (cardlenght <= cardshow) {
          $('.top-course-slider .slick-dots').hide();
        }
      }, "1000");
    },
  });

  // blog cards filter
  $.ajax({
    url: "/wp-admin/admin-ajax.php",
    type: "POST",
    dataType: "html",
    data: {
      action: "personalize_blogs",
      categories: blog_categories,
    },
    success: function (response) {
      personalizationPopup_utilities();
      $(".read-blog-section .section-title").text("Resources to ace your career");
      $(".universities-section .section-title").text("Get a degree from our 3 esteemed universities");
      if (!response || $.trim(response) === "No posts found.") {
        $(".top-online-course").css("margin-bottom", "0");
        $(".top-read-blog-slider").html("No result found.");
        $("body").removeClass("overflow-hidden");
        personalizationPopup_utilities();
        personalizationResultUtilities();
        personalizationHideSections();
      } else {
        $(".top-read-blog-slider").replaceWith(response);
        localStorage.removeItem('personalizationBlogs');
        localStorage.setItem('personalizationBlogs', response);
        personalizationResultUtilities();
        if ($(".top-read-blog-slider").length) {
          setTimeout(function () {
            blogSliderInitialize(true);
          }, 100);
        }
        personalizationHideSections();
      }
    },
  });
}

$(document).on("change", "#institution_field", function () {
  var institution = $("#institution_field").val();
  setTimeout(function () {
    if (institution == "12th") {
      $(".al-ml-with").css("display", "block");
      $(".al-ml").css("display", "none");
      $("#domain1").val('').trigger("change");
    } else {
      $(".al-ml-with").css("display", "none");
      $(".al-ml").css("display", "block");
      $("#domain").val('').trigger("change");
    }
  }, 500);
});

// User Revisit Tracking
jQuery(window).on('load', function ($) {

  function userRevisitTracking(prospectId, siteName) {
    const currentTimestamp = Date.now();
    const source = jQuery("input[name=leadsquared-Source]").val() ? jQuery("input[name=leadsquared-Source]").val() : 'Direct Traffic';
    const device = jQuery("input[name=leadsquared-mx_Device]").val();
    const website = jQuery("input[name=leadsquared-Website]").val();
    const location = jQuery("input[name=leadsquared-mx_Location]").val();
    const ip_address = jQuery("input[name=leadsquared-mx_Website_IP_Address]").val();
    jQuery.ajax({
      type: 'POST',
      url: '/wp-admin/admin-ajax.php',
      dataType: 'json',
      data: {
        action: 'revisitTracking',
        utm_source: source,
        device: device,
        website_url: website,
        location: location,
        ip_address: ip_address,
        prospectId: prospectId,
        site_name: siteName
      },
      success: function (res) {
        if (res.status === 1) {
          setCustomCookie("_" + siteName + "_revisitTime", currentTimestamp);
        }
      }
    });
  }

  function time_diff(dt2, dt1) {
    if (dt2 && dt1) {
      var res = Math.abs(dt2 - dt1) / 1000;
      var hours = Math.floor(res / 3600) % 24;
      return hours;
    } else {
      return false;
    }
  }

  setTimeout(function () {
    const MUJProspectId = getCustomCookie("_MUJ_prospectId");
    const MAHEProspectId = getCustomCookie("_MAHE_prospectId");
    const SMUProspectId = getCustomCookie("_SMU_prospectId");
    const MUJRevisitTime = getCustomCookie("_MUJ_revisitTime");
    const MAHERevisitTime = getCustomCookie("_MAHE_revisitTime");
    const SMURevisitTime = getCustomCookie("_SMU_revisitTime");
    const currentTimestamp = Date.now();
    if (MUJProspectId && (!MUJRevisitTime || (time_diff(MUJRevisitTime, currentTimestamp) >= 3))) {
      userRevisitTracking(MUJProspectId, "MUJ");
    }
    if (MAHEProspectId && (!MAHERevisitTime || (time_diff(MAHERevisitTime, currentTimestamp) >= 3))) {
      userRevisitTracking(MAHEProspectId, "MAHE");
    }
    if (SMUProspectId && (!SMURevisitTime || (time_diff(SMURevisitTime, currentTimestamp) >= 3))) {
      userRevisitTracking(SMUProspectId, "SMU");
    }
  }, 5000);

});

// set form name on button click
$(document).on("click", ".btn-position", function () {
  const buttonPosition = $(this).attr('data-position');
  const buttonForm = $(this).attr('data-form');
  setFormName(buttonPosition, buttonForm);
});
const setFormName = (buttonPosition, buttonForm) => {
  $("#" + buttonForm + ' input[name="LeadFormName"]').val(buttonPosition);
}

$(document).on("change", "#course_name_select", function () {
  var course_name = $(this).val();
  $("#course_name_val").val(course_name);
  if (course_name == "MBA") {
    var pdf_url = "/wp-content/uploads/2022/11/MUJ_Domestic_MBA-1.pdf";
  } else if (course_name == "BBA") {
    var pdf_url = "/wp-content/uploads/2022/11/MUJ_Domestic_BBA.pdf";
  } else if (course_name == "BCA") {
    var pdf_url = "/wp-content/uploads/2022/11/MUJ_Domestic_BCA-1-1.pdf";
  } else if (course_name == "MCA") {
    var pdf_url = "/wp-content/uploads/2022/11/MCA_Domestic_MUJ-2.pdf";
  } else if (course_name == "B.Com") {
    var pdf_url = "/wp-content/uploads/2022/11/MUJ_Domestic_BCOM.pdf";
  } else if (course_name == "M.Com") {
    var pdf_url = "/wp-content/uploads/2022/11/MUJ_Domestic_MCOM-2.pdf";
  } else if (course_name == "MA.JMC") {
    var pdf_url = "/wp-content/uploads/2022/11/MUJ_Domestic_MAJMC-1.pdf";
  } else if (course_name == "MA in Economics") {
    var pdf_url = "/wp-content/uploads/2024/03/MUJ_MA-ECONOMICS_DOMESTIC.pdf";
  }
  $(".download-url").text(pdf_url);
});

