var urlParams = new URLSearchParams(window.location.search);
var order_id = urlParams.get("order_id");

$(function () {
  $.get(orderDetailsListApiUrl + "?order_id=" + order_id, 
        function(response) {
    if(response) {
      var table = '';
      $.each(response, function(index, order) {
        table += `
          <tr 
            data-id="${order.order_id}" 
            data-name="${order.name}" 
            data-quantity="${order.quantity}" 
            data-total="${order.total_price}"
            data-discount="${order.discount}">
            <td>${order.order_id}</td>
            <td>${order.name}</td>
            <td>${order.quantity}</td>
            <td>${order.total_price.toFixed(2)}</td>
            <td>${order.discount.toFixed(2)}</td>
            <td><span class="btn btn-xs btn-danger view-order">Edit order</span>
          </tr>
        `;
      });
      $("table").find("tbody").html(table);
    }
  })
})