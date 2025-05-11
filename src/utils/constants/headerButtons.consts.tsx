import {
    // ADMIN_ROUTE,
    ADMIN_USERS_ROUTE,
    ADMIN_DEPART_PERSONAL_ROUTE,
    ADMIN_RELEASE_ROUTE,
    ADMIN_UNIQUEPRICE_ROUTE,
    ADMIN_PRODUCTS_ROUTE,
    ADMIN_OVERPRICE_ROUTE,
    ADMIN_MAGAZINES_ROUTE,
    ADMIN_PROVIDER_ROUTE,
    ADMIN_GOODS_ROUTE,

    // REQUEST_ROUTE,
    REQUEST_PROCESSING_ROUTE,
    REQUEST_PROCESSED_ROUTE,

    // SALES_ROUTE,
    // SALES_REQUEST_FORM_ROUTE,
    // SALES_HISTORY_ROUTE,

    // MIXERS_ROUTE,
    // MIXERS_PASTRY_ROUTE,
    MIXERS_BAKINGPRODUCTS_ROUTE,
    MIXERS_REMAIN_PRODUCTS_ROUTE,
    MIXERS_REMAIN_RAW_MATERIALS_ROUTE,
    MIXERS_SHIFT_ACCOUNTING_ROUTE,

    // RELEASE_ROUTE,
    RELEASE_DISTRIBUTION_ROUTE,
    RELEASE_REFUND_ROUTE,
    // RELEASE_REPORT_ROUTE,

    // FINANCE_ROUTE,
    FINANCE_INPUT_ROUTE,
    FINANCE_HISTORY_ROUTE,
    FINANCE_REPORT_ROUTE,

    // PURCHASE_ROUTE,
    PURCHASE_PRODUCTS_ROUTE,
    PURCHASE_DEBT_ROUTE,

    // INVENTORY_ROUTE,
    INVENTORY_DETAILS_ROUTE,
    INVENTORY_FACT_ROUTE,
    INVENTORY_HISTORY_ROUTE,

    // SELLS_ROUTE,
    SELLS_JOURNAL_ROUTE,
    SELLS_INVOICE_ROUTE,
    SELLS_DEBT_ACCOUNTING_ROUTE,
    SELLS_DEBT_TRANSFER_ROUTE,

    // REPORT_ROUTE,
    BREAD_REPORT_ROUTE,
    VISIT_REPORT_ROUTE,
    GENERAL_RECONCILIATION_REPORT_ROUTE,
    ADMIN_GOOD_CATEGORIES_ROUTE,
    RECONCILIATION_REPORT_ROUTE,
} from './routes.consts'

export type headerButton = {
    currentPage: string
    buttonsData: buttonsData[]
}

export type buttonsData = {
    path: string
    label: string
    isCurrentPage: boolean
}

export const headerButtons: headerButton[] = [
    {
        currentPage: ADMIN_USERS_ROUTE,
        buttonsData: [
            {
                path: ADMIN_USERS_ROUTE,
                label: 'Адмперсонал',
                isCurrentPage: true,
            },
            {
                path: ADMIN_DEPART_PERSONAL_ROUTE,
                label: 'Цехперсонал',
                isCurrentPage: false,
            },
        ],
    },
    {
        currentPage: ADMIN_DEPART_PERSONAL_ROUTE,
        buttonsData: [
            {
                path: ADMIN_USERS_ROUTE,
                label: 'Адмперсонал',
                isCurrentPage: false,
            },
            {
                path: ADMIN_DEPART_PERSONAL_ROUTE,
                label: 'Цехперсонал',
                isCurrentPage: true,
            },
        ],
    },
    {
        currentPage: ADMIN_RELEASE_ROUTE,
        buttonsData: [
            {
                path: ADMIN_RELEASE_ROUTE,
                label: 'Реализаторы',
                isCurrentPage: true,
            },
            {
                path: ADMIN_UNIQUEPRICE_ROUTE,
                label: 'Уникальные цены',
                isCurrentPage: false,
            },
        ],
    },
    {
        currentPage: ADMIN_UNIQUEPRICE_ROUTE,
        buttonsData: [
            {
                path: ADMIN_RELEASE_ROUTE,
                label: 'Реализаторы',
                isCurrentPage: false,
            },
            {
                path: ADMIN_UNIQUEPRICE_ROUTE,
                label: 'Уникальные цены',
                isCurrentPage: true,
            },
        ],
    },
    {
        currentPage: ADMIN_PRODUCTS_ROUTE,
        buttonsData: [
            {
                path: ADMIN_PRODUCTS_ROUTE,
                label: 'Продукты',
                isCurrentPage: true,
            },
        ],
    },
    {
        currentPage: ADMIN_PROVIDER_ROUTE,
        buttonsData: [
            {
                path: ADMIN_PROVIDER_ROUTE,
                label: 'Поставщики',
                isCurrentPage: true,
            },
            {
                path: ADMIN_GOODS_ROUTE,
                label: 'Товары',
                isCurrentPage: false,
            },
            {
                path: ADMIN_GOOD_CATEGORIES_ROUTE,
                label: 'Классификация товаров',
                isCurrentPage: false,
            },
        ],
    },
    {
        currentPage: ADMIN_GOOD_CATEGORIES_ROUTE,
        buttonsData: [
            {
                path: ADMIN_PROVIDER_ROUTE,
                label: 'Поставщики',
                isCurrentPage: false,
            },
            {
                path: ADMIN_GOODS_ROUTE,
                label: 'Товары',
                isCurrentPage: false,
            },
            {
                path: ADMIN_GOOD_CATEGORIES_ROUTE,
                label: 'Классификация товаров',
                isCurrentPage: true,
            },
        ],
    },
    {
        currentPage: ADMIN_GOODS_ROUTE,
        buttonsData: [
            {
                path: ADMIN_PROVIDER_ROUTE,
                label: 'Поставщики',
                isCurrentPage: false,
            },
            {
                path: ADMIN_GOODS_ROUTE,
                label: 'Товары',
                isCurrentPage: true,
            },
            {
                path: ADMIN_GOOD_CATEGORIES_ROUTE,
                label: 'Классификация товаров',
                isCurrentPage: false,
            },
        ],
    },
    {
        currentPage: ADMIN_OVERPRICE_ROUTE,
        buttonsData: [
            {
                path: ADMIN_OVERPRICE_ROUTE,
                label: 'Сверху',
                isCurrentPage: true,
            },
        ],
    },
    {
        currentPage: ADMIN_MAGAZINES_ROUTE,
        buttonsData: [
            {
                path: ADMIN_MAGAZINES_ROUTE,
                label: 'Магазины',
                isCurrentPage: true,
            },
        ],
    },
    {
        currentPage: REQUEST_PROCESSING_ROUTE,
        buttonsData: [
            {
                path: REQUEST_PROCESSING_ROUTE,
                label: 'Обработка',
                isCurrentPage: true,
            },
            {
                path: REQUEST_PROCESSED_ROUTE,
                label: 'Обработанные заявки',
                isCurrentPage: false,
            },
            {
                path: MIXERS_BAKINGPRODUCTS_ROUTE,
                label: 'Выпечка',
                isCurrentPage: false,
            },
        ],
    },
    {
        currentPage: REQUEST_PROCESSED_ROUTE,
        buttonsData: [
            {
                path: REQUEST_PROCESSING_ROUTE,
                label: 'Обработка',
                isCurrentPage: false,
            },
            {
                path: REQUEST_PROCESSED_ROUTE,
                label: 'Обработанные заявки',
                isCurrentPage: true,
            },
            {
                path: MIXERS_BAKINGPRODUCTS_ROUTE,
                label: 'Выпечка',
                isCurrentPage: false,
            },
        ],
    },
    {
        currentPage: MIXERS_BAKINGPRODUCTS_ROUTE,
        buttonsData: [
            {
                path: REQUEST_PROCESSING_ROUTE,
                label: 'Обработка',
                isCurrentPage: false,
            },
            {
                path: REQUEST_PROCESSED_ROUTE,
                label: 'Обработанные заявки',
                isCurrentPage: false,
            },
            {
                path: MIXERS_BAKINGPRODUCTS_ROUTE,
                label: 'Выпечка',
                isCurrentPage: true,
            },
        ],
    },
    {
        currentPage: RELEASE_DISTRIBUTION_ROUTE,
        buttonsData: [
            {
                path: RELEASE_DISTRIBUTION_ROUTE,
                label: 'Выдача',
                isCurrentPage: true,
            },
            {
                path: RELEASE_REFUND_ROUTE,
                label: 'Возврат',
                isCurrentPage: false,
            },
        ],
    },
    {
        currentPage: RELEASE_REFUND_ROUTE,
        buttonsData: [
            {
                path: RELEASE_DISTRIBUTION_ROUTE,
                label: 'Выдача',
                isCurrentPage: false,
            },
            {
                path: RELEASE_REFUND_ROUTE,
                label: 'Возврат',
                isCurrentPage: true,
            },
        ],
    },
    {
        currentPage: MIXERS_REMAIN_RAW_MATERIALS_ROUTE,
        buttonsData: [
            {
                path: MIXERS_REMAIN_RAW_MATERIALS_ROUTE,
                label: 'Остаток сырья',
                isCurrentPage: true,
            },
            {
                path: MIXERS_REMAIN_PRODUCTS_ROUTE,
                label: 'Остаток продукции',
                isCurrentPage: false,
            },
        ],
    },
    {
        currentPage: MIXERS_REMAIN_PRODUCTS_ROUTE,
        buttonsData: [
            {
                path: MIXERS_REMAIN_RAW_MATERIALS_ROUTE,
                label: 'Остаток сырья',
                isCurrentPage: false,
            },
            {
                path: MIXERS_REMAIN_PRODUCTS_ROUTE,
                label: 'Остаток продукции',
                isCurrentPage: true,
            },
        ],
    },
    {
        currentPage: MIXERS_SHIFT_ACCOUNTING_ROUTE,
        buttonsData: [
            {
                path: MIXERS_SHIFT_ACCOUNTING_ROUTE,
                label: 'Учёт смен',
                isCurrentPage: true,
            },
        ],
    },
    {
        currentPage: SELLS_JOURNAL_ROUTE,
        buttonsData: [
            {
                path: SELLS_JOURNAL_ROUTE,
                label: 'Журнал Продаж',
                isCurrentPage: true,
            },
            {
                path: SELLS_INVOICE_ROUTE,
                label: 'Накладные',
                isCurrentPage: false,
            },
            {
                path: SELLS_DEBT_ACCOUNTING_ROUTE,
                label: 'Учёт долгов',
                isCurrentPage: false,
            },
            {
                path: SELLS_DEBT_TRANSFER_ROUTE,
                label: 'Перевод долга',
                isCurrentPage: false,
            },
        ],
    },
    {
        currentPage: SELLS_INVOICE_ROUTE,
        buttonsData: [
            {
                path: SELLS_JOURNAL_ROUTE,
                label: 'Журнал Продаж',
                isCurrentPage: false,
            },
            {
                path: SELLS_INVOICE_ROUTE,
                label: 'Накладные',
                isCurrentPage: true,
            },
            {
                path: SELLS_DEBT_ACCOUNTING_ROUTE,
                label: 'Учёт долгов',
                isCurrentPage: false,
            },
            {
                path: SELLS_DEBT_TRANSFER_ROUTE,
                label: 'Перевод долга',
                isCurrentPage: false,
            },
        ],
    },
    {
        currentPage: SELLS_DEBT_ACCOUNTING_ROUTE,
        buttonsData: [
            {
                path: SELLS_JOURNAL_ROUTE,
                label: 'Журнал Продаж',
                isCurrentPage: false,
            },
            {
                path: SELLS_INVOICE_ROUTE,
                label: 'Накладные',
                isCurrentPage: false,
            },
            {
                path: SELLS_DEBT_ACCOUNTING_ROUTE,
                label: 'Учёт долгов',
                isCurrentPage: true,
            },
            {
                path: SELLS_DEBT_TRANSFER_ROUTE,
                label: 'Перевод долга',
                isCurrentPage: false,
            },
        ],
    },
    {
        currentPage: SELLS_DEBT_TRANSFER_ROUTE,
        buttonsData: [
            {
                path: SELLS_JOURNAL_ROUTE,
                label: 'Журнал Продаж',
                isCurrentPage: false,
            },
            {
                path: SELLS_INVOICE_ROUTE,
                label: 'Накладные',
                isCurrentPage: false,
            },
            {
                path: SELLS_DEBT_ACCOUNTING_ROUTE,
                label: 'Учёт долгов',
                isCurrentPage: false,
            },
            {
                path: SELLS_DEBT_TRANSFER_ROUTE,
                label: 'Перевод долга',
                isCurrentPage: true,
            },
        ],
    },
    {
        currentPage: PURCHASE_PRODUCTS_ROUTE,
        buttonsData: [
            {
                path: PURCHASE_PRODUCTS_ROUTE,
                label: 'Закуп',
                isCurrentPage: true,
            },
            {
                path: PURCHASE_DEBT_ROUTE,
                label: 'Долги по закупу',
                isCurrentPage: false,
            },
        ],
    },
    {
        currentPage: PURCHASE_DEBT_ROUTE,
        buttonsData: [
            {
                path: PURCHASE_PRODUCTS_ROUTE,
                label: 'Закуп',
                isCurrentPage: false,
            },
            {
                path: PURCHASE_DEBT_ROUTE,
                label: 'Долги по закупу',
                isCurrentPage: true,
            },
        ],
    },
    {
        currentPage: BREAD_REPORT_ROUTE,
        buttonsData: [
            {
                path: BREAD_REPORT_ROUTE,
                label: 'Отчет по продукции',
                isCurrentPage: true,
            },
            // {
            //     path: RELEASE_REPORT_ROUTE,
            //     label: 'Отчет по реализации',
            //     isCurrentPage: false,
            // },
            {
                path: VISIT_REPORT_ROUTE,
                label: 'Отчет по посещению',
                isCurrentPage: false,
            },
            {
                path: GENERAL_RECONCILIATION_REPORT_ROUTE,
                label: 'Акт сверки общий',
                isCurrentPage: false,
            },

            {
                path: RECONCILIATION_REPORT_ROUTE,
                label: 'Акт сверки',
                isCurrentPage: false,
            },
        ],
    },
    // {
    //     currentPage: RELEASE_REPORT_ROUTE,
    //     buttonsData: [
    //         {
    //             path: BREAD_REPORT_ROUTE,
    //             label: 'Отчет по продукции',
    //             isCurrentPage: false,
    //         },
    //         {
    //             path: RELEASE_REPORT_ROUTE,
    //             label: 'Отчет по реализации',
    //             isCurrentPage: true,
    //         },
    //         {
    //             path: VISIT_REPORT_ROUTE,
    //             label: 'Отчет по посещению',
    //             isCurrentPage: false,
    //         },
    //         {
    //             path: RECONCILIATION_REPORT_ROUTE,
    //             label: 'Акт сверки',
    //             isCurrentPage: false,
    //         },
    //     ],
    // },
    {
        currentPage: VISIT_REPORT_ROUTE,
        buttonsData: [
            {
                path: BREAD_REPORT_ROUTE,
                label: 'Отчет по продукции',
                isCurrentPage: false,
            },
            // {
            //     path: RELEASE_REPORT_ROUTE,
            //     label: 'Отчет по реализации',
            //     isCurrentPage: false,
            // },
            {
                path: VISIT_REPORT_ROUTE,
                label: 'Отчет по посещению',
                isCurrentPage: true,
            },
            {
                path: GENERAL_RECONCILIATION_REPORT_ROUTE,
                label: 'Акт сверки общий',
                isCurrentPage: false,
            },
            {
                path: RECONCILIATION_REPORT_ROUTE,
                label: 'Акт сверки',
                isCurrentPage: false,
            },
        ],
    },
    {
        currentPage: GENERAL_RECONCILIATION_REPORT_ROUTE,
        buttonsData: [
            {
                path: BREAD_REPORT_ROUTE,
                label: 'Отчет по продукции',
                isCurrentPage: false,
            },
            // {
            //     path: RELEASE_REPORT_ROUTE,
            //     label: 'Отчет по реализации',
            //     isCurrentPage: false,
            // },
            {
                path: VISIT_REPORT_ROUTE,
                label: 'Отчет по посещению',
                isCurrentPage: false,
            },
            {
                path: GENERAL_RECONCILIATION_REPORT_ROUTE,
                label: 'Акт сверки общий',
                isCurrentPage: true,
            },
            {
                path: RECONCILIATION_REPORT_ROUTE,
                label: 'Акт сверки',
                isCurrentPage: false,
            },
        ],
    },
    {
        currentPage: RECONCILIATION_REPORT_ROUTE,
        buttonsData: [
            {
                path: BREAD_REPORT_ROUTE,
                label: 'Отчет по продукции',
                isCurrentPage: false,
            },
            {
                path: VISIT_REPORT_ROUTE,
                label: 'Отчет по посещению',
                isCurrentPage: false,
            },
            {
                path: GENERAL_RECONCILIATION_REPORT_ROUTE,
                label: 'Акт сверки общий',
                isCurrentPage: false,
            },
            {
                path: RECONCILIATION_REPORT_ROUTE,
                label: 'Акт сверки',
                isCurrentPage: true,
            },
        ],
    },
    {
        currentPage: INVENTORY_FACT_ROUTE,
        buttonsData: [
            {
                path: INVENTORY_FACT_ROUTE,
                label: 'Ввод факт',
                isCurrentPage: true,
            },
            {
                path: INVENTORY_DETAILS_ROUTE,
                label: 'Инвентаризация',
                isCurrentPage: false,
            },
            {
                path: INVENTORY_HISTORY_ROUTE,
                label: 'История корректировок',
                isCurrentPage: false,
            },
        ],
    },
    {
        currentPage: INVENTORY_DETAILS_ROUTE,
        buttonsData: [
            {
                path: INVENTORY_FACT_ROUTE,
                label: 'Ввод факт',
                isCurrentPage: false,
            },
            {
                path: INVENTORY_DETAILS_ROUTE,
                label: 'Инвентаризация',
                isCurrentPage: true,
            },
            {
                path: INVENTORY_HISTORY_ROUTE,
                label: 'История корректировок',
                isCurrentPage: false,
            },
        ],
    },
    {
        currentPage: INVENTORY_HISTORY_ROUTE,
        buttonsData: [
            {
                path: INVENTORY_FACT_ROUTE,
                label: 'Ввод факт',
                isCurrentPage: false,
            },
            {
                path: INVENTORY_DETAILS_ROUTE,
                label: 'Инвентаризация',
                isCurrentPage: false,
            },
            {
                path: INVENTORY_HISTORY_ROUTE,
                label: 'История корректировок',
                isCurrentPage: true,
            },
        ],
    },
    {
        currentPage: FINANCE_INPUT_ROUTE,
        buttonsData: [
            {
                path: FINANCE_INPUT_ROUTE,
                label: 'Ввод',
                isCurrentPage: true,
            },
            {
                path: FINANCE_HISTORY_ROUTE,
                label: 'История финансов',
                isCurrentPage: false,
            },
            {
                path: FINANCE_REPORT_ROUTE,
                label: 'Фин. отчет',
                isCurrentPage: false,
            },
        ],
    },
    {
        currentPage: FINANCE_HISTORY_ROUTE,
        buttonsData: [
            {
                path: FINANCE_INPUT_ROUTE,
                label: 'Ввод',
                isCurrentPage: false,
            },
            {
                path: FINANCE_HISTORY_ROUTE,
                label: 'История финансов',
                isCurrentPage: true,
            },
            {
                path: FINANCE_REPORT_ROUTE,
                label: 'Фин. отчет',
                isCurrentPage: false,
            },
        ],
    },
    {
        currentPage: FINANCE_REPORT_ROUTE,
        buttonsData: [
            {
                path: FINANCE_INPUT_ROUTE,
                label: 'Ввод',
                isCurrentPage: false,
            },
            {
                path: FINANCE_HISTORY_ROUTE,
                label: 'История финансов',
                isCurrentPage: false,
            },
            {
                path: FINANCE_REPORT_ROUTE,
                label: 'Фин. отчет',
                isCurrentPage: true,
            },
        ],
    },
]
