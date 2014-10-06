function WalletCtrl(WalletService) {
    var vm = this;
    vm.wallet = {};

    vm.balance = WalletService.getBalance();

    vm.walletActions = WalletService.actions;
    vm.wallet.action = vm.walletActions[0];

    vm.submit = function(wallet) {

        // Validation
        if (wallet.amount <= 0) {
            alert('Amount entered must be greater than 0 (zero).');
            return;
        }


        // Action
        if (wallet.action.key === 'add') {
            WalletService.add(parseFloat(wallet.amount));
        } else {
            WalletService.subtract(parseFloat(wallet.amount));
        }
        WalletService.logTransaction(wallet.action, wallet.amount);
        vm.balance = WalletService.getBalance();
        vm.history = WalletService.getHistory();
    };


    vm.reset = function() {
        localStorage.clear();
        location.reload();
    }
}