namespace AbookUseCase.Models
{
    public struct JournalBalanceModel
    {
        public string Key { get; set; }
        public string AccountId { get; set; }
        public long CreditAmount { get; set; }
        public long DebitAmount { get; set; }
    }
}
