var id = "";
var modalMode = "view";
var changed = false;

function selectLeaf(arg) {
	id = arg;
	$("#leafIdDeleter").attr("value", arg);
	$.get("/getLeaf:" + arg, function(res) {
		$("#leafDate").html(new Date(res[0].timeCreated).toUTCString());
		$("#leafContent")[0].value = (res[0].content);
	});
}

function editLeaf() {
	if (modalMode == "view") {
		modalMode = "edit";
		$("#editBtn").prop("disabled", true);
		$("#deleteBtn").prop("disabled", true);
		$("#closeBtn").prop("disabled", true);
		$("#editBtn").attr("class", "btn btn-default disabled");
		$("#deleteBtn").attr("class", "btn btn-danger disabled");
		$("#closeBtn").attr("class", "btn btn-default disabled");

		$("#saveBtn").prop("disabled", false);
		$("#cancelBtn").prop("disabled", false);
		$("#saveBtn").attr("class", "btn btn-success");
		$("#cancelBtn").attr("class", "btn btn-danger");
		$("#leafContent").prop("disabled", false);
	}
}

function commitChangesToLeaf() {
	if (modalMode == "edit") {
		var text = $("#leafContent")[0].value;
		$.ajax({
			url: "/updateLeaf",
			method: "POST",
			data: {_id: id, content: text}
		});

		$("#saveBtn").prop("disabled", true);
		$("#cancelBtn").prop("disabled", true);
		$("#saveBtn").attr("class", "btn btn-success disabled");
		$("#cancelBtn").attr("class", "btn btn-danger disabled");
		$("#leafContent").prop("disabled", true);

		$("#editBtn").prop("disabled", false);
		$("#deleteBtn").prop("disabled", false);
		$("#closeBtn").prop("disabled", false);
		$("#editBtn").attr("class", "btn btn-default");
		$("#deleteBtn").attr("class", "btn btn-danger");
		$("#closeBtn").attr("class", "btn btn-default");

		modalMode = "view";
		changed = true;
	}
}

function cancelChangesToLeaf() {
	if (modalMode == "edit") {
		$.get("/getLeaf:" + id, function(res) {
			$("#saveBtn").prop("disabled", true);
			$("#cancelBtn").prop("disabled", true);
			$("#saveBtn").attr("class", "btn btn-success disabled");
			$("#cancelBtn").attr("class", "btn btn-danger disabled");
			$("#leafContent").prop("disabled", true);

			$("#editBtn").prop("disabled", false);
			$("#deleteBtn").prop("disabled", false);
			$("#closeBtn").prop("disabled", false);
			$("#editBtn").attr("class", "btn btn-default");
			$("#deleteBtn").attr("class", "btn btn-danger");
			$("#closeBtn").attr("class", "btn btn-default");

			modalMode = "view";

			$("#leafDate").html(new Date(res[0].timeCreated).toUTCString());
			$("#leafContent")[0].value = (res[0].content);
		});
	}
}

function deleteLeaf() {
	$.get("/deleteLeaf:" + id, function(res) {
		if (res == "OK") {
			location.reload();
		}
	});
}
