import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";

export async function generateMetadata() {
    return {
        title: "Контактная информация магазина truck-import",
        description:
            "Свяжитесь с нами любым удобным способом. Контактная информация магазина truck-import: телефон, email, адрес и время работы. Мы всегда на связи!",
    };
}

const phoneNumbers = [
    { number: "+7 (495) 740-33-06", href: "tel:+74957403306" },
    { number: "+7 (909) 913-11-86", href: "tel:+79099131186" },
];

export default async function Page() {
    return (
        <main>
            <section className={styles.contacts__hero}>
                <div className={styles.contacts__item}>
                    <h1 className={styles.contacts__title}>Контакты</h1>
                    <div className={styles.contact__method}>
                        <p className={styles.contact__method_name}>Телефон:</p>
                        <div className={styles.contact__method_phones}>
                            <Link
                                href={phoneNumbers[0].href}
                                className={styles.contact__method_phone}
                            >
                                {phoneNumbers[0].number}
                            </Link>
                            <Link
                                href={phoneNumbers[1].href}
                                className={styles.contact__method_phone}
                            >
                                {phoneNumbers[1].number}
                            </Link>
                        </div>
                    </div>
                    <div className={styles.contact__method}>
                        <p className={styles.contact__method_name}>Email:</p>
                        <Link
                            href={`mailto:import-aa@mail.ru`}
                            className={styles.contact__method_value}
                        >
                            import-aa@mail.ru
                        </Link>
                    </div>
                    <div className={styles.contact__method}>
                        <p className={styles.contact__method_name}>
                            Режим работы:
                        </p>
                        <p className={styles.contact__method_value}>
                            Пн-пт: 9:00 - 18:00
                        </p>
                    </div>
                </div>

                <div className={styles.contacts__item}>
                    <h2>Мы на карте</h2>
                    <iframe
                        src="https://yandex.ru/map-widget/v1/?um=constructor%3A68332f3d177a559fb7b8de668a2c1649f9c0bbbf09ac42a567aa41fec18d98f7&amp;source=constructor"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                    ></iframe>
                </div>
                <div className={styles.contacts__item}>
                    <p>
                        <span>Почтовый адрес:</span>
                    </p>
                    <p>
                        Тел/факс:{" "}
                        <Link href={`tel:89269261359`}>8 (926) 926 13-59</Link>;
                        111625, Москва, Каскадная улица, 20к2, пом.1
                    </p>
                </div>
            </section>

            <section className={styles.requisites}>
                <h2 className={styles.requisites__title}>Наши реквизиты</h2>
                <div className={styles.requisites__inner}>
                    <div className={styles.contact__method}>
                        <p className={styles.contact__method_name}>Номер счёта</p>
                        <p className={styles.contact__method_value}>40802810301380002924</p>
                    </div>
                    <div className={styles.contact__method}>
                        <p className={styles.contact__method_name}>Валюта</p>
                        <p className={styles.contact__method_value}>RUR</p>
                    </div>
                    <div className={styles.contact__method}>
                        <p className={styles.contact__method_name}>Название</p>
                        <p className={styles.contact__method_value}>
                            ШЕВЦОВ АНТОН АЛЕКСАНДРОВИЧ (ИП)
                        </p>
                    </div>
                    <div className={styles.contact__method}>
                        <p className={styles.contact__method_name}>ИНН</p>
                        <p className={styles.contact__method_value}>772071947050</p>
                    </div>
                    <div className={styles.contact__method}>
                        <p className={styles.contact__method_name}>Банк</p>
                        <p className={styles.contact__method_value}>АО &quot;АЛЬФА-БАНК&quot;</p>
                    </div>
                    <div className={styles.contact__method}>
                        <p className={styles.contact__method_name}>БИК</p>
                        <p className={styles.contact__method_value}>044525593</p>
                    </div>
                    <div className={styles.contact__method}>
                        <p className={styles.contact__method_name}>Кор. счёт</p>
                        <p className={styles.contact__method_value}>30101810200000000593</p>
                    </div>
                    <div className={styles.contact__method}>
                        <p className={styles.contact__method_name}>Адрес получателя</p>
                        <p className={styles.contact__method_value}>
                            улица Каскадная, д. 20, корп./ст. 2, кв./оф. 69, г. Москва
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.socials}>
                <h2 className={styles.socials__title}>
                    Мы в социальных сетях:
                </h2>
                <div className={styles.socials__inner}>
                    <Link className={styles.social} href="#">
                        <Image
                            src="/whatsapp.svg"
                            alt="whatsapp"
                            width={500}
                            height={300}
                        />
                    </Link>
                    <Link className={styles.social} href="#">
                        <Image
                            src="/telegram.svg"
                            alt="telegram"
                            width={500}
                            height={300}
                        />
                    </Link>
                </div>
            </section>
        </main>
    );
}
