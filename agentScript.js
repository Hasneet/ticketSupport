var endpoint = "http://03bc-203-81-240-107.ngrok.io";
var flag = false;

$(document).ready(function () {
  document.getElementById("header-id").innerHTML = "";
  document.getElementById("sub-header-id").innerHTML = "";

  $("#btn-unassigned-id").attr("disabled", true);
  $("#btn-mytickets-id").attr("disabled", true);
  document.getElementById("btn-unassigned-id").style.cursor = "default";
  document.getElementById("btn-mytickets-id").style.cursor = "default";

  $("#agent-id").keyup(function () {
    if (document.getElementById("agent-id").value == "") {
      $("#btn-unassigned-id").attr("disabled", true);
      $("#btn-mytickets-id").attr("disabled", true);
      document.getElementById("btn-unassigned-id").style.background = "grey";
      document.getElementById("btn-unassigned-id").style.cursor = "default";
      document.getElementById("btn-unassigned-id").style.color = "#fbfdff";

      document.getElementById("btn-mytickets-id").style.background = "grey";
      document.getElementById("btn-mytickets-id").style.cursor = "default";
      document.getElementById("btn-mytickets-id").style.color = "#fbfdff";

      //   document.getElementById("sub-header-id").remove();
      //   flag = false;
    } else {
      //   $("#header-id").append(`<h5 id="sub-header-id"></h5>`);

      $("#btn-unassigned-id").attr("disabled", false);
      $("#btn-mytickets-id").attr("disabled", false);
      document.getElementById("btn-unassigned-id").style.background = "#a7e245";
      document.getElementById("btn-unassigned-id").style.cursor = "pointer";
      document.getElementById("btn-unassigned-id").style.color = "#3b4465";

      document.getElementById("btn-mytickets-id").style.background = "#a7e245";
      document.getElementById("btn-mytickets-id").style.cursor = "pointer";
      document.getElementById("btn-mytickets-id").style.color = "#3b4465";
    }
  });

  $("#agent-id").keyup(function () {
    if (flag) {
      document.getElementById(
        "sub-header-id"
      ).innerHTML = `Agent ID changed to ${
        document.getElementById("agent-id").value
      } - <span style="color:#31a700">REFRESH</span> (Click on 'Unassigned Button')`;
    }
  });
});

function onClickUnassigned() {
  flag = true;
  let agentId = document.getElementById("agent-id").value;

  document.getElementById("header-id").innerHTML = "Unassigned Tickets";
  document.getElementById(
    "sub-header-id"
  ).innerHTML = `Click to assign to Agent ID ${agentId}`;

  $("#left-section-area").empty();
  var arr = [];

  $.ajax({
    type: "json",
    method: "GET",
    url: `${endpoint}/agents/unassigned-queries`,
    success: function (result) {
      arr = result.data;
      console.log(result);

      $("#left-section-area").append(`<ul class="no-bullets"></ul>`);
      for (var item of arr) {
        var li = `<li style="cursor: pointer">`;
        var div = ` <div class="cards"">
                      <div class="card card-1 flex-div-class">                        
                          <h3 class="card__title">${item.Querie_Subject}</h3>
                          <button onclick="onClickListButton('${item.Id}','${agentId}')">Assign to self</button>
                      </div>
                  </div>`;
        $("ul").append(li.concat(div));
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function onClickListButton(queryId, assigneeId) {
  $.ajax({
    type: "json",
    method: "POST",
    url: `${endpoint}/agents/assign-query`,
    data: {
      assigneeId,
      queryId,
    },
    success: function (result) {
      console.log(result);

      var x = document.getElementById("snackbar");
      document.getElementById("snackbar").innerHTML = "Ticket Assigned";
      x.className = "show";
      setTimeout(function () {
        x.className = x.className.replace("show", "");
      }, 3000);

      onClickUnassigned();
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function onClickMyTickets() {
  document.getElementById("header-id").innerHTML = "My Tickets";
  document.getElementById("sub-header-id").innerHTML = "";
  $("#left-section-area").empty();

  var arr = [];
  let agentId = document.getElementById("agent-id").value;

  $.ajax({
    type: "json",
    method: "GET",
    url: `${endpoint}/agents/assigned-query-list?assigneeId=${
      document.getElementById("agent-id").value
    }`,
    success: function (result) {
      arr = result.data;
      console.log(result);

      $("#left-section-area").append(`<ul class="no-bullets"></ul>`);
      for (var item of arr) {
        var li = `<li style="cursor: pointer">`;
        var div = ` <div class="cards" onclick="onClickMyTicketItem('${item.Id}','${item.User_Id}','${item.Querie_Subject}')">
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
}

function onClickMyTicketItem(Query_Id, Id, Querie_Subject) {
  var arr = [];
  $.ajax({
    type: "json",
    method: "GET",
    url: `${endpoint}/queries/query-messages?userId=${Id}&queryId=${Query_Id}`,
    success: function (result) {
      arr = result.data;

      $("#left-section-area").empty();
      document.getElementById(
        "sub-header-id"
      ).innerHTML = `Subject: <span style="color:#31a700">${Querie_Subject}</span>`;

      $("#left-section-area").append(`<ul class="no-bullets"></ul>`);
      for (var item of arr) {
        var li = `<li style="cursor: pointer">`;
        var rightAlignResponse =
          item.Msg_Type === "RESPONSE" ? "" : "msgcard-right-align";
        var div = ` <div class="card card-1 msgcard ${rightAlignResponse}">
                  <h3 class="card__title">${item.Msg}</h3>
                </div>`;
        $("ul").append(li.concat(div));
      }
      $("#left-section-area").append(
        `​<textarea id="existing-list-message" rows="5" maxlength="250" name="existing-list-message-name" required></textarea>
        <span id='newNewMsg'></span>
        <button type="button" class="btn-login" id="exisiting-btn-submit-id" onclick="submitNewMessage('${Id}','${Query_Id}', '${Querie_Subject}')">Submit</button>`
      );

      var lenMsg = 0;
      var maxcharMessage = 250;

      $("#existing-list-message").keyup(function () {
        console.log($(this).val());
        if (document.getElementById("existing-list-message").value == "") {
          // $("#btn-login-id").attr("disabled", true);
          document.getElementById("exisiting-btn-submit-id").style.background =
            "grey";
          document.getElementById("exisiting-btn-submit-id").style.color =
            "#fff";
        } else {
          // $("#btn-login-id").attr("disabled", false);
          document.getElementById("exisiting-btn-submit-id").style.background =
            "#a7e245";
          document.getElementById("exisiting-btn-submit-id").style.color =
            "#3b4465";
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
}
function submitNewMessage(assigneeId, queryId, Querie_Subject) {
  var assigneeMsg = document.getElementById("existing-list-message").value;
  $.ajax({
    type: "json",
    method: "POST",
    url: `${endpoint}/agents/save-response`,
    data: {
      assigneeId,
      queryId,
      assigneeMsg,
    },
    success: function (result) {
      var x = document.getElementById("snackbar");
      document.getElementById("snackbar").innerHTML = "Message Sent";
      x.className = "show";
      setTimeout(function () {
        x.className = x.className.replace("show", "");
      }, 3000);

      onClickMyTicketItem(queryId, assigneeId, Querie_Subject);
    },
    error: function (error) {
      console.log(error);
    },
  });
}
