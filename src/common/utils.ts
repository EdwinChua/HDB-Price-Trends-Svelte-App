import type { HDB_Resale_Flat_Record } from 'src/models/record';
export default class Utils {

    static formatDate(monthYearString: string) {
        const [year, month] = monthYearString.split('-');
        // change 01 to Jan, 02 to Feb, etc.
        const monthString = new Date(`${year}-${month}-01`).toLocaleString('en-us', {
            month: 'short',
            year: 'numeric'
        });
        return monthString;
    }

    static filterResaleFlatData(originalData: HDB_Resale_Flat_Record[], block: string, flatType:string): HDB_Resale_Flat_Record[] {
        let filteredData: HDB_Resale_Flat_Record[] = originalData.map(item => item); // make a copy
        if (block && block !== '') {
            filteredData = filteredData.filter(item => item.block === block)
        } 
        if (flatType && flatType !== '') {
            filteredData = filteredData.filter(item => item.flat_type === flatType)
        }
        return filteredData;
    }

    static sortDataByMonth(a, b) {
		return Utils.getDateObj(a.month).getTime() - Utils.getDateObj(b.month).getTime();
	}

    static sortDataByMonth_Reverse(b, a) {
		return Utils.getDateObj(a.month).getTime() - Utils.getDateObj(b.month).getTime();
	}

    static getDateObj(monthYearString: string) {
		const [year, month] = monthYearString.split('-');
		return new Date(`${year}-${month}-01`);
	}
}