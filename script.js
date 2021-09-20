const switchers = [...document.querySelectorAll(".switcher")];
var endpoint = "http://03bc-203-81-240-107.ngrok.io";

switchers.forEach((item) => {
  item.addEventListener("click", function () {
    switchers.forEach((item) =>
      item.parentElement.classList.remove("is-active")
    );
    this.parentElement.classList.add("is-active");
  });
});

$(document).ready(function () {
  var lenSubject,
    lenMsg = 0;
  var maxcharSubject = 25;

  $("#new-subject").keyup(function () {
    onChangeNewForm();
    lenSubject = this.value.length;
    if (lenSubject > maxcharSubject) {
      return false;
    } else if (lenSubject > 0) {
      $("#newRemainingSubject").html(
        "Remaining characters: " + (maxcharSubject - lenSubject)
      );
    } else {
      $("#newRemainingSubject").html("Remaining characters: " + maxcharSubject);
    }
  });

  var maxcharMessage = 250;

  $("#new-message").keyup(function () {
    onChangeNewForm();
    lenMsg = this.value.length;
    if (lenMsg > maxcharMessage) {
      return false;
    } else if (lenMsg > 0) {
      $("#newRemainingMessage").html(
        "Remaining characters: " + (maxcharMessage - lenMsg)
      );
    } else {
      $("#newRemainingMessage").html("Remaining characters: " + maxcharMessage);
    }
  });

  $("#new-user-id").keyup(function () {
    onChangeNewForm();
  });

  $(function () {
    // Open Popup
    $("[popup-open]").on("click", function () {
      var popup_name = $(this).attr("popup-open");
      $('[popup-name="' + popup_name + '"]').fadeIn(300);
    });

    // Close Popup
    $("[popup-close]").on("click", function () {
      var popup_name = $(this).attr("popup-close");
      $('[popup-name="' + popup_name + '"]').fadeOut(300);
    });

    // Close Popup When Click Outside
    $(".popup")
      .on("click", function () {
        var popup_name = $(this).find("[popup-close]").attr("popup-close");
        $('[popup-name="' + popup_name + '"]').fadeOut(300);
      })
      .children()
      .click(function () {
        return false;
      });
  });

  $("#btn-continue-id").attr("disabled", true);
  $("#existing-user-id").keyup(function () {
    if (
      document.forms["existing-form-name"]["existing-user-id-name"].value == ""
    ) {
      document.getElementById("btn-continue-id").style.color = "grey";
      document.getElementById("btn-continue-id").style.boxShadow =
        "inset 0 0 0 2px grey";
      $("#btn-continue-id").attr("disabled", true);
    } else {
      document.getElementById("btn-continue-id").style.color = "#a7e245";
      document.getElementById("btn-continue-id").style.boxShadow =
        "inset 0 0 0 2px #a7e245";
      $("#btn-continue-id").attr("disabled", false);
    }
  });

  $("existing-form-name").on("submit", function (e) {
    e.preventDefault();
  });
});

function onClickSubmit() {
  let userId = document.getElementById("new-user-id").value;
  let querieSubject = document.getElementById("new-subject").value;
  let queryMsg = document.getElementById("new-message").value;

  $.ajax({
    type: "json",
    method: "POST",
    url: `${endpoint}/queries`,
    data: {
      userId,
      querieSubject,
      queryMsg,
    },
    success: function (result) {
      console.log(result);
      document.getElementById("new-user-id").value = "";
      document.getElementById("new-subject").value = "";
      document.getElementById("new-message").value = "";

      var x = document.getElementById("snackbar");
      x.className = "show";
      setTimeout(function () {
        x.className = x.className.replace("show", "");
      }, 3000);
    },
    error: function (error) {
      console.log(error);
    },
  });
}

//   disable button if no value
function onChangeNewForm() {
  if (
    document.forms["new-form-name"]["new-user-id-name"].value == "" ||
    document.forms["new-form-name"]["new-subject-name"].value == "" ||
    document.forms["new-form-name"]["new-message-name"].value == ""
  ) {
    // $("#btn-login-id").attr("disabled", true);
    document.getElementById("btn-submit-id").style.background = "grey";
  } else {
    // $("#btn-login-id").attr("disabled", false);
    document.getElementById("btn-submit-id").style.background = "#a7e245";
  }
}

function openSubmitModel() {
  let userId = document.getElementById("existing-user-id").value;
  $("#existing-tickets").empty();

  var arr = [];

  $.ajax({
    type: "json",
    method: "GET",
    url: `${endpoint}/queries?userId=${userId}`,
    success: function (result) {
      arr = result.data;
      console.log(result);

      $("#existing-tickets").append(`<ul class="no-bullets"></ul>`);
      for (var item of arr) {
        var li = `<li style="cursor: pointer">`;
        // var div = `<div class="existing-ticket-list">${arr[i]}</div>`;
        var div = ` <div class="cards" onclick="listItemOnClick('${item.Id}', '${item.Querie_Subject}','${userId}')">
                      <div class="card card-1">
                        <h3 class="card__title">${item.Querie_Subject}</h3>                   
                        </div>
                     </div>`;
        $("ul").append(li.concat(div));
      }
    },
    error: function (error) {
      console.log(error);
    },
  });

  document.getElementById("existing-tickets-heading").innerHTML =
    "Existing tickets";
}

function listItemOnClick(queryId, subject, userId) {
  // CALL API TO FETCH RECORDS HERE
  var arr = [];
  $.ajax({
    type: "json",
    method: "GET",
    url: `${endpoint}/queries/query-messages?userId=${userId}&queryId=${queryId}`,
    success: function (result) {
      arr = result.data;
      console.log(result);

      // ON RESPONSE
      $("#existing-tickets").empty();

      $("#existing-tickets").append(`<ul class="no-bullets"></ul>`);
      for (var item of arr) {
        var li = `<li style="cursor: pointer">`;
        var rightAlignResponse =
          item.Msg_Type === "QUERY" ? "" : "msgcard-right-align";
        var div = ` <div class="card card-1 msgcard ${rightAlignResponse}">
                  <h3 class="card__title">${item.Msg}</h3>
                </div>`;
        $("ul").append(li.concat(div));
      }
      $("#existing-tickets").append(
        `​<textarea id="existing-list-message" rows="5" maxlength="250" name="existing-list-message-name" required></textarea>
        <span id='newNewMsg'></span>
        <button type="button" class="btn-login" id="exisiting-btn-submit-id" onclick="submitNewMessage('${userId}','${queryId}', '${subject}')">Submit</button>`
      );

      var lenMsg = 0;
      var maxcharMessage = 250;

      $("#existing-list-message").keyup(function () {
        console.log($(this).val());
        if (document.getElementById("existing-list-message").value == "") {
          // $("#btn-login-id").attr("disabled", true);
          document.getElementById("exisiting-btn-submit-id").style.background =
            "grey";
        } else {
          // $("#btn-login-id").attr("disabled", false);
          document.getElementById("exisiting-btn-submit-id").style.background =
            "#a7e245";
        }

        lenMsg = this.value.length;
        if (lenMsg > maxcharMessage) {
          return false;
        } else if (lenMsg > 0) {
          $("#newNewMsg").html(
            "Remaining characters: " + (maxcharMessage - lenMsg)
          );
        } else {
          $("#newNewMsg").html("Remaining characters: " + maxcharMessage);
        }
      });
    },
    error: function (error) {
      console.log(error);
    },
  });

  document.getElementById("existing-tickets-heading").innerHTML = subject;
}

function submitNewMessage(userId, queryId, subject) {
  var queryMsg = document.getElementById("existing-list-message").value;

  $.ajax({
    type: "json",
    method: "POST",
    url: `${endpoint}/queries/save-query-message`,
    data: {
      userId,
      queryId,
      queryMsg,
    },
    success: function (result) {
      console.log(result);
      listItemOnClick(queryId, subject, userId);
    },
    error: function (error) {
      console.log(error);
    },
  });
}
