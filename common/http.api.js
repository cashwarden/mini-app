// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)
let recordUrl = '/records';
let loginUrl = '/login';
let userMeUrl = '/users/me';
let categoriesUrl = '/categories';
let accountsUrl = '/accounts';
let ledgersCategoriesUrl = '/ledgers/categories';
let transactionsByDescriptionUrl = '/transactions/by-description?expand=ledger,category,fromAccount,toAccount';

// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
	// 此处没有使用传入的params参数
	let getRecords = (params = {}) => vm.$u.get(recordUrl, params);

	let getUserMe = (params = {}) => vm.$u.get(userMeUrl, params);

	let deleteRecord = (id) => vm.$u.delete(`${recordUrl}/${id}`);

	let login = (params = {}) => vm.$u.post(loginUrl, params);

	let transactionsByDescription = (params = {}) => vm.$u.post(transactionsByDescriptionUrl, params);

	let getCategories = (params = {}) => vm.$u.get(categoriesUrl, params);

	let getLedgersCategories = (params = {}) => vm.$u.get(ledgersCategoriesUrl, params);

	let getAccounts = (params = {}) => vm.$u.get(accountsUrl, params);
	let postAccounts = (params = {}) => vm.$u.post(accountsUrl, params);
	let getAccountOverview = () => vm.$u.get(`${accountsUrl}/overview`);
	let getAccountTypes = (params = {}) => vm.$u.get(`${accountsUrl}/types`, params);
	let deleteAccount = (id) => vm.$u.delete(`${accountsUrl}/${id}`);

	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {
		getRecords,
		login,
		transactionsByDescription,
		getUserMe,
		deleteRecord,
		getCategories,
		getLedgersCategories,
		getAccounts,
		getAccountTypes,
		getAccountOverview,
		deleteAccount,
		postAccounts
	};
}

export default {
	install
}