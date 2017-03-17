function newLeaf() {
	$.ajax({
		method: "POST",
		url: "newLeaf",
		data: {content: $("#newLeafContent")[0].value},
		success: location.reload()
	});
}
