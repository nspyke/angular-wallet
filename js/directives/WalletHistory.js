function WalletHistory(WalletService) {
    return {
        restrict: 'E',
        templateUrl: 'partial/wallet-history.html',
        controllerAs: 'whvm',
        controller: function() {
            this.history = WalletService.getHistory();
        }
    }
}