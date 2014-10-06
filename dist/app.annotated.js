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
WalletCtrl.$inject = ["WalletService"];;function WalletHistory(WalletService) {
    return {
        restrict: 'E',
        templateUrl: 'partial/wallet-history.html',
        controllerAs: 'whvm',
        controller: function() {
            this.history = WalletService.getHistory();
        }
    }
}
WalletHistory.$inject = ["WalletService"];;function WalletService() {
    this.balance = null;
    this.history = null;

    this.actions = [
        {key: 'add', label: 'Deposit'},
        {key: 'sub', label: 'Withdraw'}
    ];

    this.add = function(value) {
        this.balance += value;
        this.persist();
    };

    this.subtract = function(value) {
        if (this.balance - value < 0) {
            this.balance = 0;
        } else {
            this.balance -= value;
        }

        this.persist();
    };

    this.persist = function() {
        if (typeof(localStorage) == 'undefined' ) {
            alert('Your browser does not support HTML5 localStorage. Try upgrading.');
        } else {
            try {
                localStorage.setItem('history', JSON.stringify(this.history));
                localStorage.setItem('balance', this.balance);
            } catch (e) {
                if (e == QUOTA_EXCEEDED_ERR) {
                    alert('Quota exceeded!'); //data wasn’t successfully saved due to quota exceed so throw an error
                }
            }
        }
    };

    this.getBalance = function() {
        if (this.balance === null) {
            this.balance = this.getBalanceFromStorage();
        }

        return this.balance;
    };

    this.logTransaction = function(action, amount) {
        var trans = {
            date: new Date(),
            amount: amount,
            deposit: false,
            withdrawal: false
        };

        if (action.key === 'add') {
            trans.deposit = true;
        } else {
            trans.withdrawal = true;
        }

        this.history.push(trans);
        this.persist();
    };

    this.getHistory = function() {
        if (this.history === null) {
            this.history = this.getHistoryFromStorage();
        }

        return this.history;
    };

    this.getBalanceFromStorage = function() {
        // Using HTML 5 local storage.
        // In most cases would fall back to API call as shown below
        // but the endpoint does not exist in this demo.
        if (typeof(localStorage) == 'undefined' ) {
            alert('Your browser does not support HTML5 localStorage. Try upgrading.');
        } else {
            var balance = localStorage.getItem('balance');
            if (balance === null) {
                return 0;
            }

            return parseFloat(balance);
        }

        return 0;

        /* --- EXAMPLE
         var self = this;
         $http.get('/balance.json')
         .success(function(response){
         self.balance = response.value;
         return self.balance;
         })
         */
    };

    this.getHistoryFromStorage = function() {

        // Using HTML 5 local storage.
        // In most cases would fall back to API call as shown below
        // but the endpoint does not exist in this demo.
        if (typeof(localStorage) == 'undefined' ) {
            alert('Your browser does not support HTML5 localStorage. Try upgrading.');
        } else {
            var history = localStorage.getItem('history');

            if (history === null) {
                return [];
            }

            return JSON.parse(history);
        }

        return [];

        /* --- EXAMPLE
         var self = this;
         $http.get('/history.json')
         .success(function(response){
         self.history = response;
         return self.history;
         })
         */
    }
};(function(){
    angular
        .module('wallet', [])
        .service('WalletService', WalletService)
        .controller('WalletCtrl', WalletCtrl)
        .directive('walletHistory', WalletHistory);

    angular.module('app', ['wallet']);
})();