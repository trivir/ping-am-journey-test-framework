import { loadConfig } from "../config";

import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";

/**
 * Checks an email inbox for a specific message and extracts an OTP (One-Time Password) using a parser.
 *
 * This function connects to an IMAP email server, searches the inbox for the latest email matching
 * the specified sender and subject, retrieves the email, and uses a provided parser function to extract
 * the OTP from the email's text content.
 *
 * @param  options - Configuration options for checking the email.
 * @param  options.sender - The email address of the sender to filter messages. If undefined, no sender filter is applied.
 * @param  options.subject - The subject line of the email to filter messages. If undefined, no subject filter is applied.
 * @param  options.emailParser - A function that takes the email's text content parses the desired value. The default parser handles emails where an OTP is the only text or it is at the end after a :.
 * @param  options.timeDelay - Time in milliseconds to wait before searching for the email. Defaults to 5000 milliseconds
 * @returns  - A promise that resolves to the extracted OTP value.
 *
 * @throws  - Throws an error if there is an issue connecting to the email server, fetching emails, or parsing the message.
 *
 * @example
 * const otp = await checkEmail({
 *   sender: "no-reply@example.com",
 *   subject: "Your OTP Code",
 *   emailParser: (text) => text.match(/\d{6}/)?.[0] || "",
 * });
 * console.log(`Extracted OTP: ${otp}`);
 */
export async function checkEmail({
	sender,
	subject,
	emailParser,
	timeDelay,
}: {
	sender?: string;
	subject?: string;
	emailParser?: (str: string) => string;
	timeDelay?: number;
}) {
	const { GMAIL, GMAIL_APP_PASSWORD } = loadConfig();

	const client = new ImapFlow({
		host: "smtp.gmail.com",
		port: 993,
		secure: true,
		auth: {
			user: GMAIL,
			pass: GMAIL_APP_PASSWORD,
		},
		logger: false,
	});

	let otpValue = "";
	await delay(timeDelay !== undefined ? timeDelay : 5000);
	await client.connect();
	const lock = await client.getMailboxLock("INBOX");
	try {
		let searchFilter = {};
		if (sender) {
			searchFilter = { ...searchFilter, from: sender };
		}
		if (subject) {
			searchFilter = { ...searchFilter, subject: subject };
		}

		const list = await client.search(searchFilter);

		if (list.length < 1) {
			throw new Error("No emails were found using the provided filter");
		}

		const message = await client.fetchOne(String(list[list.length - 1]), {
			source: true,
		});

		const parsed = await simpleParser(message.source);

		if (emailParser) {
			otpValue = emailParser(parsed.text || "");
		} else {
			otpValue = extractOTPFromEmail(parsed.text || "");
		}
	} finally {
		lock.release();
	}

	await client.logout();

	return otpValue;
}

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractOTPFromEmail(str: string) {
	const parts = str.split(":");

	if (parts.length > 1) {
		return parts[1].trim();
	}
	return parts[0].trim();
}
