import {toTomanCurrency} from "@/utils/number";

const styles = `
table {
  display: table;
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border: 3px solid purple;
  direction: rtl;
  border-radius: 8px;
}

thead th:nth-child(1) {
  width: 30%;
}

thead th:nth-child(2) {
  width: 20%;
}

thead th:nth-child(3) {
  width: 15%;
}

thead th:nth-child(4) {
  width: 35%;
}

tr:nth-child(even) {
    background-color: #ededed;
}

table,
th,
td {
  padding: 20px;
  border: 1px solid gray;
}
`

export function exportToPdf(headers: any[], rows: any[], filename: string | null = null) {
    const table = document.createElement("table");

    const thead = document.createElement("thead")
    const tbody = document.createElement("tbody")
    const style = document.createElement("style")
    const headtr = thead.insertRow()

    style.innerText = styles

    headers.forEach((header) => {
        const th = headtr.insertCell()
        th.appendChild(document.createTextNode(header?.header));
    })

    rows.forEach((row) => {
        const tr = tbody.insertRow()
        row = row.original

        headers.forEach((item) => {
            const key = item?.meta?.key
            const td = tr.insertCell()
            let value = (row[key] || "-")

            if (item?.meta?.isPrice) {
                value = toTomanCurrency(value) + " تومان"
            }

            td.appendChild(document.createTextNode(value as string));
        })
    })

    table.appendChild(thead)
    table.appendChild(tbody)

    const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no, width=0,height=0,left=-1000,top=-1000`;
    const newWin = window.open("about:blank", "print", params);

    // @ts-ignore
    newWin.document.head.innerHTML = `<style>${styles}</style>`;
    // @ts-ignore
    newWin.document.body.appendChild(table);
    // @ts-ignore
    newWin.print()
}