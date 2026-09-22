function setFieldError(name, message) {
  const $field = $(`.form-field[data-field="${name}"]`);
  $field.addClass("has-error");
  $field.find(".field-error").text(message);
}

function clearFieldErrors() {
  $(".form-field").removeClass("has-error");
  $(".field-error").text("");
}

function validate(values) {
  const errors = {};
  if (!values.business_name) errors.business_name = "Business name is required.";
  if (!values.owner_name) errors.owner_name = "Owner name is required.";
  if (!values.category) errors.category = "Choose a category.";
  if (!values.city) errors.city = "City is required.";
  if (!values.email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (values.website && !/^https?:\/\/.+/.test(values.website)) {
    errors.website = "Website should start with http:// or https://";
  }
  return errors;
}

$(function () {
  $("#submitForm").on("submit", function (e) {
    e.preventDefault();
    clearFieldErrors();

    const values = {
      business_name: $("#business_name").val().trim(),
      owner_name: $("#owner_name").val().trim(),
      category: $("#category").val(),
      city: $("#city").val().trim(),
      tagline: $("#tagline").val().trim(),
      website: $("#website").val().trim(),
      email: $("#email").val().trim(),
    };

    const errors = validate(values);
    if (Object.keys(errors).length) {
      Object.entries(errors).forEach(([field, message]) => setFieldError(field, message));
      return;
    }

    const $btn = $("#submitBtn");
    $btn.prop("disabled", true).text("Submitting…");

    $.ajax({
      url: `${API_BASE_URL}/api/businesses`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(values),
      timeout: 60000,
    })
      .done(function () {
        $("#submitForm").hide();
        $("#successPanel").show();
      })
      .fail(function (xhr) {
        if (xhr.status === 400 && xhr.responseJSON && xhr.responseJSON.fields) {
          Object.entries(xhr.responseJSON.fields).forEach(([field, message]) =>
            setFieldError(field, message)
          );
        } else {
          setFieldError("business_name", "Something went wrong — please try again in a moment.");
        }
      })
      .always(function () {
        $btn.prop("disabled", false).text("Submit business");
      });
  });

  $("#addAnotherBtn").on("click", function () {
    $("#submitForm")[0].reset();
    clearFieldErrors();
    $("#successPanel").hide();
    $("#submitForm").show();
  });
});
