$(function () {
    //Json data by api call for order table
    $.get(orderListApiUrl, function (response) {
        if(response) {
            var table = '';
            var totalCost = 0;
            $.each(response, function(index, order) {
                totalCost += parseFloat(order.total);
                table += `
                    <tr 
                        data-id="${order.order_id}" 
                        data-name="${order.customer_name}" 
                        data-datetime="${order.datetime}" 
                        data-total="${order.total}">
                        <td>${order.datetime}</td>
                        <td>${order.order_id}</td>
                        <td>${order.customer_name}</td>
                        <td>${order.total.toFixed(2)} Rs</td>
                        <td><span class="btn btn-xs btn-danger view-order">View order</span>
                    </tr>;`
            });
            table += '<tr><td colspan="3" style="text-align: end"><b>Total</b></td><td><b>'+ totalCost.toFixed(2) +' Rs</b></td></tr>';
            $("table").find('tbody').empty().html(table);
        }
    });
});