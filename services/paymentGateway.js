async function createCheckout({
    payment
}) {

    /*
     * Temporary gateway layer.
     *
     * The real gateway will be connected
     * in the next step.
     */


    return {

        success: true,

        transactionId:
            `TEST-${payment._id}`,

        redirectUrl:
            `/payment-test?id=${payment._id}`

    };

}


module.exports = {
    createCheckout
};