import moment from "jalali-moment";
import {download, generateCsv, mkConfig} from "export-to-csv";

export function exportToCsv(headers: string[], rows: any[], filename: string | null = null): void {
    if (!filename) {
        filename = moment(new Date()).format("YYYY-MM-DD").toString()
    }

    const csvConfig = mkConfig({
        fieldSeparator: ',',
        filename,
        decimalSeparator: '.',
        useKeysAsHeaders: true,
        columnHeaders: headers,
        replaceUndefinedWith: '-',
    })

    const csv = generateCsv(csvConfig)(rows)
    download(csvConfig)(csv)
}