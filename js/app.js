(function(){
    angular
        .module('wallet', [])
        .service('WalletService', WalletService)
        .controller('WalletCtrl', WalletCtrl)
        .directive('walletHistory', WalletHistory);

    angular.module('app', ['wallet']);
})();