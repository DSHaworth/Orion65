// https://jasonwatmore.com/post/2019/05/02/angular-7-mock-backend-example-for-backendless-development
// https://jasonwatmore.com/post/2018/10/29/angular-7-user-registration-and-login-example-tutorial
// https://stackblitz.com/edit/angular-7-registration-login-example

// General solution for handling errors?
// https://scotch.io/@vigneshsithirai/angular-6-7-http-client-interceptor-with-error-handling

import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

let tests = [
  { "id": 1, "name": "Test 1", "chapters": [
    { "id": 1, "name": "Chapter 1", "questions": [
      {
        "question": "The term issuer, as defined in the Securities Act of 1933, would include<br/> I. A government entity issuing exempt securities.<br/> II. A corporation issuing securities in an exempt transaction.<br/> III. An antique dealer selling items from a collection of rare books.",
        "responses": [
          {"response": "I and II", correct: true},
          {"response": "II and III", correct: false},
          {"response": "III only", correct: false},
          {"response": "I, II, and III", correct: false},
        ],
        "reason": "An issue is a person who issues a security whether or not he security is exempt. in the question, the antique dealer is issuing collectibles, not securities."
      },
      {
        "question": "Under the Securities Act of 1933, which of the following is NOT a security?",
        "responses": [
          {"response": "A convertible bond", correct: false},
          {"response": "A stock warrant", correct: false},
          {"response": "A stock right", correct: false},
          {"response": "A term live insurance policy", correct: true},
        ],
        "reason": "A security is any note, stock, bond, certificate of interest or participation in any profit sharing arrangement, investment contract, certificate of depotis for a security, interest in oil, gas, or mining rights, or any investment commonly considered a security. (Generally, it is an investment contract wherein the investor is passive and expects a return on the investment through the efforts of others.) The definition of a security does not include direct ownership of real estate, commodities, futures contracts (e.g., corn, wheat), collectibles, precious metals, or life insurance or annuity contracts that have fixed payouts."
      },      
      {
        "question": "Which of the following statements about accredited investors is TRUE?",
        "responses": [
          {"response": "Taxpayers who report an income in excess of 200,000 on a joint return in each of the last two years and who reasonable expect the same for the current year are included in the definition.", correct: false},
          {"response": "An officer, Director, or greater than 10% shareholder of any company listed on the NYSE would be considered an accredited investor for purposes of acquiring a private placement your firm is selling.", correct: false},
          {"response": "The term includes an employee benefit plan with assets in excess of $2 million.", correct: false},
          {"response": "Purchases of securities by accredited investors do not count toward the 35-Investor limitation found in Rule 506(b) of Regulation D.", correct: true},
        ],
        "reason": "One fo the benefits of this term is that these investors do not count in the numerical limitation placed on private placements made under Rule 506(b). Note that for offerings made under Rule 506(c), all investors must be accredited. When filing a joint return, the income requirement is $300,000, and an employee benefit plan must have assets in excess of $5 million. Insiders are only considered accredited investors when it is that issuer's security being offered."
      },
      {
        "question": "A man owns 15% of the stock of a company. His wife owns 5% of the stock's of the same company if the wife wishes to sell the stock she owns, which of the following statements are TRUE?<br>I. Both the husband and the wife are affiliates<br>II. He is an affiliate, but she is not.<br>III. She must file under Rule 144.<br>IIII. She does not have to file under Rule 144.",
        "responses": [
          {"response": "I and III", correct: true},
          {"response": "I and IV", correct: false},
          {"response": "II and III", correct: false},
          {"response": "II and IV", correct: false},
        ],
        "reason": "His 15% ownership is control. Her 5% is not, but the fact that she is the spouse of an affiliate makes her one, causing this to be a sale of control stock. All Sales of control stock (unless an exemption applies) must be accompanied by a Rule 144 filing."
      },
      {
        "question": "An Agent receives instruction from a client to by 100 shares of KAPCO common stock at what the agent thinks is the best price. Two days later, the agent enters the order. In this case, the agent has",
        "responses": [
          {"response": "acted appropriately", correct: false},
          {"response": "acted inappropriately", correct: true},
          {"response": "failed to follow the customer's instructions", correct: false},
          {"response": "potentially become the subject to statutory disqualification", correct: false},
        ],
        "reason": "Whenever the order call or time/price discretion, it is considered a day order and must are executed that day. Waiting two days inappropriate."
      },
      {
        "question": "Alice Allison is the president of Podunk University and sits on the board of directors of KAPCO Securities, a broker-dealer registered with the SEC. President Allison",
        "responses": [
          {"response": "would be considered an associated person of KAPCO", correct: true},
          {"response": "would not be considered an associated person of KAPCO", correct: false},
          {"response": "would be required to register as an agent of KAPCO", correct: false},
          {"response": "must resign her position at Podunk University in order to remain on KAPCO's board", correct: false},
        ],
        "reason": "University presidents are popular choice for serving as outside directors. Under the 'Securities Exchange Ac of 1934, the term associated person of a broker-dealer would include an outside director fo a broker-dealer and all registered personnel but not employees who are strictly clerical and administrative."
      },
      {
        "question": "A securities order that is initiated by a client is what type of order?",
        "responses": [
          {"response": "Nondiscretionary", correct: false},
          {"response": "Unsolicited", correct: true},
          {"response": "Discretionary", correct: false},
          {"response": "Solicited", correct: false},
        ],
        "reason": "this is the definition of an unsolicited transaction"
      },
      {
        "question": "Under the Securities act of 1934, as amended, registration with the SEC would be required of<br>I. a broker-dealer whose business is strictly municipal securities<br>II. a broker-dealer whose business is strictly in non-Nasdaq over-the-counter securities<br>III. a banking institution dealing in municipal bonds",
        "responses": [
          {"response": "I and II", correct: true},
          {"response": "I and III", correct: false},
          {"response": "II and III", correct: false},
          {"response": "I, II, and III", correct: false},
        ],
        "reason": "The 1975 Amendments required, for the first time, that nay firm engaged in the municipal securities business be registered with the SEC. Ever since 1934, broker-dealers engage in any phase of the securities markets have been required to register with the sec. Banks (financial institutions) are member of the MSRB but are exempt from SEC registration."
      },
      {
        "question": "Provisions under the Securities Exchange Act of 1934 include all of the following EXCEPT",
        "responses": [
          {"response": "requiring that all issues listed on a national securities exchange be registered with the SEC", correct: false},
          {"response": "prohibiting manipulative practices such as wash trades and misleading statements", correct: false},
          {"response": "requiring full disclosure regarding an upcoming IPO", correct: true},
          {"response": "requiring registration of transfer agents", correct: false},
        ],
        "reason": "The disclosure requirement for new issue (IPOs) is found in the Securities Act of 1933"
      },
      {
        "question": "Which of the following would be considered investment companies under the Act of 1940<br>I. Face-amount certificate company<br>II. Unit investment trust<br>III.ddd Management company<br>IV. Holding company<br>V. Insurance company",
        "responses": [
          {"response": "I, II, and III", correct: true},
          {"response": "I, II, III and IV", correct: false},
          {"response": "I, II, III and V", correct: false},
          {"response": "I, II, III, IV, and V", correct: false},
        ],
        "reason": "Holding companies and insurance companies are specifically excluded form the definition of an investment company."
      },
      {
        "question": "How do closed-end investment companies differ from open-end investment companies?<br>I. Closed-end companies register their shares with the SEC; open-end companies do not<br>II. the only time a prospectus is used with the sale of a closed-end company is on the IPO; sales of open-end must always be preceded or accompanied by a prospectus.<br>III. Closed-end companies issue fixed number of shares; open-end companies continuously issue new shares.<br>IV. Closed-end companies may only sell shares to institutional investors; open-end companies can sell to any investor.",
        "responses": [
          {"response": "I and II", correct: false},
          {"response": "I and IV", correct: false},
          {"response": "II and III", correct: true},
          {"response": "III and IV", correct: false},
        ],
        "reason": "Closed-end companies issue a fixed number of shares, whereas open-end companies do not specify the number of shares to be issued. Both types of company register issues with the SEC, and any investor may invest in either type of company. Open-end shares must always be sold with a prospectus because each is a newly issued share."
      },
      {
        "question": "A financial reporter notices that the quoted price of one investment company's shares is at 22% discount from the NAV. From this information it can be deduced that the company must be a(n)",
        "responses": [
          {"response": "closed-end investment company", correct: true},
          {"response": "contractual plan of a mutual fund", correct: false},
          {"response": "open-end investment company", correct: false},
          {"response": "unit investment trust", correct: false},
        ],
        "reason": "If sell ing pricer of an investment company is less than the NAV, the fund must be closed-end investment company."
      },
      {
        "question": "All of the following statements regarding a 12b-1 company are true EXCEPT",
        "responses": [
          {"response": "the plan must be initially approved by at least a majority of the out-standing voting securities of the investment company", correct: false},
          {"response": "the plan must be renewed by a majority fo the fund's directors", correct: false},
          {"response": "the plan may be terminated by a vote of the majority of shareholders or a majority of the board of directors", correct: true},
          {"response": "the rule only applies to open-end investment companies", correct: false},
        ],
        "reason": "The plan may be terminated bah a majority vote of the shareholders or a majority vote of the board of directors who are non interested directors of the fund. a 12b-1 plan wouldn't work with anything other than an open-end investment company."
      },
      {
        "question": "The Investment Company Act of 1940 prohibits registered investment companies from engaging in any of the following practices EXCEPT",
        "responses": [
          {"response": "issuing common stock", correct: true},
          {"response": "selling short or purchase securities for the company's portfolio on margin", correct: false},
          {"response": "owning more than 3% of the outstanding voting securities of another investment company", correct: false},
          {"response": "opening a joint account with another investment company", correct: false},
        ],
        "reason": "The one thing that all investment companies must do is issue common stock. That is the form of ownership. All of the other activities are prohibited."
      },
      {
        "question": "ABC is an FINRA member broker-dealer. Among other functions, it serves as the principal underwriter of the XYZ Mutual Fund. Which of the following transaction of ABC would be prohibited unless exemptive relief was offered by the SEC?",
        "responses": [
          {"response": "ABC tenders, from its investment account, 500 shares of the XYZ Mutual Fund for redemption", correct: false},
          {"response": "ABC purchase, for its investment account, 500 shares of the XYZ Mutual Fund", correct: false},
          {"response": "ABC purchases some securities directly from XYZ's portfolio", correct: true},
          {"response": "All", correct: false},
        ],
        "reason": "Without an exemptive order from the SEC, it would be a violation of the Investment Company Act of 1940 for any affiliated person to purchase any security form an investment company other than shares o the fund itself."
      },
      {
        "question": "Which of the following statements correctly expresses the requirements under the Investment Company Act of 1940?<br><br>I. A registered open-end investment company using a bank as custodian must choose one that has FDIC coverage.<br>II. If an affiliated person of the registered investment company wishes to borrow money from the fund, there must be at least 300% asset coverage.<br>III. No investment advisory contract may be entered into that does not provide for termination with no more than 60 days notice in writing.<br>IV. No registered investment company may acquire more than 3% of the shares of another investment company.",
        "responses": [
          {"response": "I and II", correct: false},
          {"response": "I and IV", correct: false},
          {"response": "II and III", correct: false},
          {"response": "III and IV", correct: true},
        ],
        "reason": "The Investment Company Act of 1940 requires that all advisory contract contain a provision that the contract may be terminated upon no more than 60 days noice in writing. the Act prohibits any registered investment company form owning more than 3% of the shares of another investment company. There are no circumstances under which an affiliated person can borrow form the fund, and it is not requirement that the custodian bank have FDIC insurance."
      },
      {
        "question": "Under which of the following circumstances would a purchase of mutual fund shares at a price below the public offering price be allowed?<br><br>I. The purchase is made by the designated agent of an incorporated investment club that reaches the breakpoint.<br>II. A parent buys enough to reach the breakpoint but places half the order in his account and the other half in an account for which his wife is designated as custodian for their son.<br>III. The receptions for the XYZ Growth Fund purchases $100 of that fund.<br>IV. A financial planner bunches his clients' orders and turns them in as one in and amount sufficient to reach the breakpoint.",
        "responses": [
          {"response": "I and II", correct: false},
          {"response": "I and III", correct: false},
          {"response": "II and III", correct: true},
          {"response": "II, III and IV", correct: false},
        ],
        "reason": "Any family unit may combine purchases in as many accounts as it wishes to reach the breakpoint for reduced sales charges. Most often, this is spouses and custodial accounts for minor children (there are exception-not tested). If an employee of the fund (the receptionist) purchase for his own account, the sales charge is usually eliminated altogether. A Purchase made for a group, such as an investment club or multiple clients with no common purpose other than investment, is not eligible for a reduction."
      },
      {
        "question": "Under the Securities Act of 1933, the Securities and Exchange Commission has the authority to:<br><br>I. Issue stop orders<br>II. approve new issues<br>III. review standard registration forms",
        "responses": [
          {"response": "I and III", correct: true},
          {"response": "I, II and III", correct: false},
          {"response": "II and III", correct: false},
        ],
        "reason": "During the cooling-off period, the SEC reviews registration statements and may issue stop orders. The SEC does not approve securities; it only clears them for distribution to the public."
      },
      {
        "question": "Which of the following best describes 12b-1 fee?",
        "responses": [
          {"response": "A fee imposed against a mutual fund company for violating SEC rules.", correct: false},
          {"response": "A fee charged by some mutual funds to redeem shares that have been held less than one year.", correct: false},
          {"response": "A fee charge to all mutual funds to cover the expense of FINRA regulation.", correct: false},
          {"response": "A fee charge by some mutual funds to cover sales and distribution expenses", correct: true},
        ],
        "reason": "A 12b-1 fee may be charged by mutual funds that do not charge maximum permissible sales land. SEC Rule 12-b01 allows a mutual fund to serve as distributer of its own shares and charge a percentage of the average net assets for distribution and sales-related expenses."
      },
      {
        "question": "A major stockholder of the XYZ Corporation makes frequent purchases and sales of this stock on the open market to give the impression that it is actively traded. This unethical practice is best described as:",
        "responses": [
          {"response": "Pegging", correct: false},
          {"response": "Matched orders", correct: true},
          {"response": "Front running", correct: false},
          {"response": "positioning", correct: false},
        ],
        "reason": "Matched orders, or painting the tape, occurs when there is no real change in beneficial ownership. Purchases and sales are offset, but the volume of trading creates the illusion of substantial interest ion the stock."
      },
      {
        "question": "Under the Securities Cat of 1933, securities issued by charitable organizations are exempt if:",
        "responses": [
          {"response": "the net earnings from the organization are paid to less than 10 private stockholders", correct: false},
          {"response": "the organization is a nonprofit company", correct: true},
          {"response": "the organization is funded by government grants.", correct: false},
          {"response": "no commissions are paid on the distribution of shares", correct: false},
        ],
        "reason": "Charitable or religious organizations must be nonprofit in order to gain exemption from full registration"
      },
      {
        "question": "Which of the following is(are) TRUE regarding the Securities Exchange Act of 1934<br><br>I. the act bars the use of credit to purchase new issues<br>II. the act prohibits the simultaneous purchase and sale of a security to create the appearing of trading.<br>III. the act prohibits the spread of false rumors to induce other to trade",
        "responses": [
          {"response": "I, II and III", correct: true},
          {"response": "II and III", correct: false},
          {"response": "I and III", correct: false},
          {"response": "I and II", correct: false},
        ],
        "reason": "the Securities Exchange Act of 1934 specifically bars the use of credit to purchase new issues and also prohibits installment payments when making such purchases. The act also prohibits any form of manipulation of securities prices or any practices that would influence the market price of a security. This includes wash trades, which are simultaneous purchase and sales that create the appearance of trading activity, and the use of rumor to induce others to trade."
      },      
    ]},
    { "id": 2, "name": "Chapter 2", "questions": [
      {
        "question": "TRUE/FALSE: A final order may be entered only after opportunity for hearing has been granted.",
        "responses": [
          {"response": "True", correct: true},
          {"response": "False", correct: false},
        ],
        "reason": "A final order, such as a suspension or revocation, may only be entered after the opportunity for a hearing has been generated."
      },      
      {
        "question": "True/False: If an administrator determines that registration statement for a security is incomplete, he may issue a cease and desist order.",
        "responses": [
          {"response": "True", correct: false},
          {"response": "False", correct: true},
        ],
        "reason": "Cease and desist order are directed at securities professionals. Stop order are used for securities offerings."
      },      
      {
        "question": "True/False: Under the Uniform Securities Act, the city of Atlanta would be included in the definition of the term person.",
        "responses": [
          {"response": "True", correct: true},
          {"response": "False", correct: false},
        ],
        "reason": "Government and political subdivisions are considered person under the act. Remember there are only three choices that are not a person-minors persons since deceased, and those judged mentally incompetent."
      },      
      {
        "question": "True/False: The GEMCO Employees Retirement Plan currently has assets of $750,000. Under the Uniform Securities Act, the plan would be considered an institutional investor.",
        "responses": [
          {"response": "True", correct: false},
          {"response": "False", correct: true},
        ],
        "reason": "In order for an employee benefit plant o be included in definition of institution, it must have assets of not less than $1 Million."
      },      
      {
        "question": "What is the Official designation of the person or agency that enforces the USA in each state?",
        "responses": [
          {"response": "Administrator", correct: true},
          {"response": "Transfer agent", correct: false},
          {"response": "Registrar", correct: false},
          {"response": "Issuer", correct: false},
        ],
        "reason": "The USA specifies that a State's securities Administrator has the authority to enforce the act in their state. A transfer agent is the person or corporation responsible for recording the names and holding of registered security owners."
      },      
      {
        "question": "True/False: In General a person who effects transactions in securities for itself or for the account of others in the course of business must register in the state as a broker-dealer.",
        "responses": [
          {"response": "True", correct: true},
          {"response": "False", correct: false},
        ],
        "reason": "A person who effects transaction in securities for itself or for the account of others must register in the state as a broker-dealer unless specifically excluded from the definition or exempt form registration"
      },      
      {
        "question": "True/False: Under the Uniform Securities Act, an out-of-state firm that transacts business with an established customer who is on vacation is not considered a broker-dealer in the state in which the customer is on vacation.",
        "responses": [
          {"response": "True", correct: true},
          {"response": "False", correct: false},
        ],
        "reason": "A firm with an out-of-state registration is not considered a broker-dealer in that sate if transacting business with a. customer who is passing through the sate on vacation."
      },      
      {
        "question": "True/False: A person not defined as a broker-dealer in the state under the USA need not register as such.",
        "responses": [
          {"response": "True", correct: true},
          {"response": "False", correct: false},
        ],
        "reason": "If a person is excluded from the definition that person need not register as a broker-dealer; however, if they are not excluded (or exempt), they must register."
      },      
      {
        "question": "True/False: A broker-dealer registered with the SEC and several states must meet the net capital standard of the state with the most stringent requirements.",
        "responses": [
          {"response": "True", correct: false},
          {"response": "False", correct: true},
        ],
        "reason": "When a broker-dealer is registered with both the SEC and several sates (the usual case), the financial and operational requirements to be met are those of the SEC."
      },      
      {
        "question": "Under the Uniform Securities Act, a broker-dealer is defined as any person who",
        "responses": [
          {"response": "buys securities", correct: false},
          {"response": "sells securities", correct: false},
          {"response": "is in the business of effecting securities transactions for its own account or for the accounts of others.", correct: true},
          {"response": "is registered with the SEC", correct: false},
        ],
        "reason": "A broker-dealer is any person, partner, officer, director, or securities firm engage in the business of effecting securities transactions for the accounts of others (broker) or for its own account (dealer)."
      },      
      {
        "question": "Under the Uniform Securities Act, the term agent would include an individual who represents an issuer in effecting non-exempt transactions in",
        "responses": [
          {"response": "a city of Montreal general obligation bond", correct: false},
          {"response": "common stock offered by a commercial bank", correct: false},
          {"response": "a New Jersey Turnpike Revenue bond", correct: false},
          {"response": "commercial paper with a 19-month maturity", correct: true},
        ],
        "reason": "There is a special group of fixe exempt issuers (U.S. and Canadian government and municipal users; foreign governments; banks; commercial paper; and investment contracts related to employee benefit plans) where an individual representing the issuer is not an agent. This is true whether the transaction is exempt or non-exempt. In addition, when representing any exempt issuer (not just the five listed), in an exempt transaction, the individual is not an agent. However, if the issue is not exempt (commercial paper's exemption is limited to 9 months) and, as the question points out, the transaction is non-exempt, then the individual must register as an agent of that issuer."
      },      
      {
        "question": "Under the Uniform Securities Act, the term agent would include",
        "responses": [
          {"response": "an individual who represents an issuer in an exempt transaction", correct: false},
          {"response": "an individual who represents a broker-dealer in a transaction in an exempt security", correct: true},
          {"response": "a receptionist for a broker-dealer who directs calls for trade information to the appropriate individual", correct: false},
          {"response": "the Vice President of personnel for a nation brokerage firm.", correct: false},
        ],
        "reason": "All of the exclusions form the term agent refer to an individual representing an issuer. As long as the transaction is exempt, the individual is not deemed to be an agent. There is no case on the exam where an individual performing a sales function for a broker-dealer is not an agent.<br>Clerical persons are not agent, nor are officers with no apparent sales function."
      },      
      {
        "question": "Is an agent Yes or No: Person who effect transaction in municipal securities on behalf of a broker-dealer",
        "responses": [
          {"response": "Yes", correct: true},
          {"response": "No", correct: false},
        ],
        "reason": "Persons must be registered as agent when they effect transaction on behalf of broker-dealers whether or no the securities are exempt."
      },      
      {
        "question": "Is an agent Yes Or No: An agent's salaried secretary that takes orders.",
        "responses": [
          {"response": "Yes", correct: true},
          {"response": "No", correct: false},
        ],
        "reason": "Any individual taking order on behalf of a broker-dealer must be registered whether or not they receive a commission."
      },      
      {
        "question": "Is an agent Yes or No: An employee for a bank that is issuing shares who receives a commission for selling the bank's securities.",
        "responses": [
          {"response": "Yes", correct: false},
          {"response": "No", correct: true},
        ],
        "reason": "Employees of a bank engaging in retail sales of securities issued buy the bank are not agents regardless of how they are compensated."
      },      
      {
        "question": "Is an agent Yes or No: An individual who represent her nonexempt employer in the sale of its securities to existing employees for a commission.",
        "responses": [
          {"response": "Yes", correct: true},
          {"response": "No", correct: false},
        ],
        "reason": "A person who represent an employer in selling securities to employees must register as an agent if the person receives a commission. If no commission is paid, registration is not necessary."
      },      
      {
        "question": "Is an agent Yes or No: A person who represents an issuer in effecting transactions with underwriters.",
        "responses": [
          {"response": "Yes", correct: false},
          {"response": "No", correct: true},
        ],
        "reason": "Persons who represent issuers in exempt transactions, such as with underwriters, need not register as agents."
      },      
      {
        "question": "Under the Uniform Securities Act, an Individual licensed as an agent by the state may NOT",
        "responses": [
          {"response": "simultaneously represent two different unrelated broker-dealers in the same transaction", correct: true},
          {"response": "be licensed by both an independent insurance company and a securities broker-dealer", correct: false},
          {"response": "be registered with two broker-dealers under common control", correct: false},
          {"response": "be registered with a licensed real estate broker as well as with a licensed securities broker-dealer", correct: false},
        ],
        "reason": "A registered agent may not simultaneously represent two different unrelated broker-dealers in the same transaction. Under current regulation, only a few states allow agents to have dual registration with more than one broker-dealer, unless those broker-dealers are under common management. In those cases, the agent may only represent one of the broker-dealers in any single transaction. Agent of broker-dealers may be simultaneously registered with real estate agencies, insurance companies and with with two broker-dealers, provided the broker-dealers are under common ownership or control or the arrangement has ben authorized by the administrator."
      },      
      {
        "question": "True/False: A consent to service of process must be submitted with each renewal application.",
        "responses": [
          {"response": "True", correct: false},
          {"response": "False", correct: true},
        ],
        "reason": "A consent to service of process is filed with the initial application and permanently remains on file with Administrator."
      },      
      {
        "question": "True/False: A Canadian broker-dealer, properly registered with the Administrator of the province in which he is headquartered and with no office in the sate, may do business with his customers who are on a skiing vacation in Vail without registering with he Colorado Administrator.",
        "responses": [
          {"response": "True", correct: false},
          {"response": "False", correct: true},
        ],
        "reason": "In order to do business with their Canadian customers who are temporarily in any state(s), Canadian broker-dealers (and their agents) must obtain a form of limited registration."
      },      
      {
        "question": "True/False: When a securities professional registers in a state, he must provide the state Administrator with a. list of all the states where he intends to register.",
        "responses": [
          {"response": "True", correct: true},
          {"response": "False", correct: false},
        ],
        "reason": "Whether the form BD for a broker-dealer or the Form U-4 for an agent, the registrant must check the box(es) listing all jurisdictions in which the applicant is registering (or already registered). this is also required for investment advisers and their representatives."
      },      
      {
        "question": "According to the uniform Securities Act, a consent to service of process must accompany which of the following?<br><br>I. Agent's initial registration application<br>II. Civil complaint against a broker-dealer<br>III. Broker-dealer's initial registration application<br>IV. A cease and desist order",
        "responses": [
          {"response": "I and III", correct: true},
          {"response": "I and IV", correct: false},
          {"response": "II and III", correct: false},
          {"response": "II and IV", correct: false},
        ],
        "reason": "A broker-dealer, an agent, an investment advisor representative, or a state registered investment adviser must file a consent to service of process with the Administrator upon filing a registration application. The consent to service of process give the Administrator the right to process legal complaints against the applicant. In some states, a federal covered adviser may also be required to furnish a consent to service of process."
      },      
      {
        "question": "Which of the following is NOT a factor when a communication to be distributed to the public is either being reviewed or approved b y the broker-dealer?",
        "responses": [
          {"response": "Whether statements of benefits are balanced with statements of potential risks", correct: false},
          {"response": "The nature of the audience to which the communication is intended to be distributed", correct: false},
          {"response": "Whether the piece will be distributed in written from or on the firm's website", correct: true},
          {"response": "Whether the communication is targeting existing customers or prospective ones", correct: false},
        ],
        "reason": "The format is not what counts; it's the content that matters."
      },      
      {
        "question": "The regulatory bodies consider which of the following social media sites to be predominately used for business rather than personal communications?",
        "responses": [
          {"response": "Facebook", correct: false},
          {"response": "Instagram", correct: false},
          {"response": "LinkedIn", correct: true},
          {"response": "Twitter", correct: false},
        ],
        "reason": "LinkedIn is viewed as a site used far more for business purposes than the others."
      },      
      {
        "question": "Which list of instruments below is NOT composed of securities?",
        "responses": [
          {"response": "Stock, Treasury Stock, rights, warrants, and transferable shares", correct: false},
          {"response": "Voting trust certificates and interests in oil and gas drilling programs", correct: false},
          {"response": "commodity futures contracts and fixed payment life insurance contracts", correct: true},
          {"response": "Options on securities and interests in multilevel distributorship arrangements", correct: false},
        ],
        "reason": "Comodity futures contracts and fixed payment life insurance contracts are included in our list of 6 items that are not securities."
      },      
      {
        "question": "The U.S. Supreme Court defined an investment contract as having four components. Which of the following is NOT part of the four-part test for an investment contract?",
        "responses": [
          {"response": "An investment of money", correct: false},
          {"response": "An expectation of profit", correct: false},
          {"response": "Management activity by owner", correct: true},
          {"response": "Solely from the efforts of others", correct: false},
        ],
        "reason": "Management activity on the part of the owner is not part of the Howey, or four-part, test for an instrument to be a security. The four parts are: (1) an investment of money in (2) a common enterprise with (3) an expectation of profit (4) solely from the effort of others."
      },      
      {
        "question": "Nonexempt securities",
        "responses": [
          {"response": "need not be registered in the state in which they are sold", correct: false},
          {"response": "must always be registered in the state in which they are sold", correct: false},
          {"response": "need not be registered if sold in an exempt transaction", correct: true},
          {"response": "Need not be registered if sold in a nonexempt transaction", correct: false},
        ],
        "reason": "Nonexempt means the sercurity is not exempt from the the state's registration requirements. However, if the nonexempt security is sold in an exempt transaction, registration is not required."
      },      
      {
        "question": "A nonissue transaction is a transaction",
        "responses": [
          {"response": "between two corporation where one is issuing the stock and the other is purchasing.", correct: false},
          {"response": "in which the issuer of the security will not receive the proceeds form the transaction", correct: true},
          {"response": "where a mutual fund purchase a treasury bond directly from the government", correct: false},
          {"response": "where registration is always required", correct: false},
        ],
        "reason": "A nonissue transaction is one where the company that is the issuer of the security does not receive the proceeds from the transaction. A nonissue transaction is a transaction between two investors and may or may not require the security to be registered depending on whether the security or the transaction (or both) are exempt. Whenever the proceeds go the the issuer, it is an issuer transaction."
      },      
      {
        "question": "True/False: ABC Shoe Company, a new retail shoe store chain, has applied for the registration of its securities with the SEC as required by the Securities Act of 1933 and want to register its securities in the state of Illinois and several neighboring states. ABC would most likely register by coordination.",
        "responses": [
          {"response": "True", correct: true},
          {"response": "False", correct: false},
        ],
        "reason": "Registration by coordination involves coordination a state registration with that of a federal registration."
      },      
      {
        "question": "True/False: Any company may register by qualification whether or not it files a statement with the SEC.",
        "responses": [
          {"response": "True", correct: true},
          {"response": "False", correct: false},
        ],
        "reason": "Any company may register by qualification. However, in virtually all cases, qualification is only used when it is the only choice, such as for intrastate offerings."
      },      
      {
        "question": "XYZ corporation has been in business for over 20 years. they need additional capital for expansion, and determine that a public offering in their home state and neighboring states is appropriate. Which method of securities registration would most likely be used to register this initial public offering?",
        "responses": [
          {"response": "Coordination", correct: true},
          {"response": "Notice filing", correct: false},
          {"response": "Qualification", correct: false},
          {"response": "Registration", correct: false},
        ],
        "reason": "Because this offering is being made in more than one state, SEC registration is necessary. The state registration method would be coordination, which is the simultaneous registration of a security with both the SEC and the states."
      },      
      {
        "question": "KAPCO Dividend Yield Fund, a closed-end investment company registered under the Investment Company Act of 1940, wishes to commence offering its shares in States A, B, C, and D. It could be required to",
        "responses": [
          {"response": "coordinate is federal registration with each of the four states", correct: false},
          {"response": "notice file", correct: true},
          {"response": "register by qualification in each of the states", correct: false},
          {"response": "do none of these because investment companies registered under the Investment Act of 1940 are federal covered securities and are exempt from registration", correct: false},
        ],
        "reason": "Although these are federal covered securities and exempt form traditional registration, it could, at the discretion of the Administrator, be required to engage in a notice filing."
      },      
      {
        "question": "Which of the following securities is(are) exempt from the registration and advertising filing requirements under the USA?<br><br>I. Shares of investment companies registered under the Investment Company Act of 1940<br>II. Shares sold on the Nasdaq Stock Market<br>III. AAA rated promissory notes of $100,000 that mature in 30 days<br>IV. Shares sold on the New York Stock Exchange",
        "responses": [
          {"response": "I only", correct: false},
          {"response": "II, III, and IV", correct: false},
          {"response": "II and IV", correct: false},
          {"response": "I, II, III, and IV", correct: true},
        ],
        "reason": "Securities issued by registered investment companies and those sold on the NYSE and Nasdaq Stock Market are federal covered securities and, therefor, do not register with the states. Commercial paper with a maximum maturity of 270 days, in denomination of the than $50,000 and a top three rating are sept under the Uniform Securities Act"
      },      
      {
        "question": "Which of the following securities is NOT exempt from the registration and advertising requirements of the USA?",
        "responses": [
          {"response": "Shares of Commonwealth Edison, a regulated public utility holding company", correct: false},
          {"response": "Securities issued by the Carnegie Endowment for Peace", correct: false},
          {"response": "Securities issued by a bank that is a member of the Federal Reserve System", correct: false},
          {"response": "Variable annuity contracts issued by Metrodential Insurance Company", correct: true},
        ],
        "reason": "Variable annuities (whose performance depends on the securities in a segregated fund) are nonexempt, which means they are covered by the act and have to register. Share in public utitimles, charitable foundations, and banking institutions that are member of the Federal Reserve System are included in our list of exempt securities."
      },      
      {
        "question": "Which of the following securities is(are) exempt form the registration provisions of the USA?<br><br>I. Issue of a saving and loan association authorized to conduct business in the state<br>II. General obligation municipal bond<br>III. bond issued by a company that has common stock listed on the Chicago Stock Exchange",
        "responses": [
          {"response": "I only", correct: false},
          {"response": "II only", correct: false},
          {"response": "II and III", correct: false},
          {"response": "I, II, and III", correct: true},
        ],
        "reason": "the USA exempts from registration a number of different issues. Included in the group are securities issued by depository institution including a savings and loan association that is authorized to do business in the state. Securities issued by a governmental unit are always exempt. Any security senior to a common stock that is federal covered security is itself considered federal covered and, therefore, exempt from state registration."
      },      
      {
        "question": "Securities exempt under the Uniform Securities Act are exempt form<br><br>I. Registration requirements<br>II. antifraud provisions of state securities laws<br>III. filing sales and advertising literature with the Administrator",
        "responses": [
          {"response": "I and II", correct: false},
          {"response": "I and III", correct: true},
          {"response": "II and III", correct: false},
          {"response": "I, II and III", correct: false},
        ],
        "reason": "An exempt security is exempt from the registration requirements and the provisions that require the filing of advertising and sales literature. Exempt securities are never exempt form the antifraud provision of the act."
      },      
      {
        "question": "Is Transaction Exempt: Mr. Thompson, an agent with the First Securities, Inc. (a broker-dealer), receives an unsolicited request to purchase a security for Mary Gordon, a long-timeclient",
        "responses": [
          {"response": "Yes", correct: true},
          {"response": "No", correct: false},
        ],
        "reason": "Mr. Thompson's receipt for an unsolicited order from Ms. Gordon is an exempt transaction."
      },      
      {
        "question": "Is Transaction Exempt: The sale of an unregistered security in a private, non publicly advertised transaction, offered to 10 or fewer retail investors over the previous 12 months.",
        "responses": [
          {"response": "Yes", correct: true},
          {"response": "No", correct: false},
        ],
        "reason": "The sale of unregistered security in a private, non publicly advertised transaction to 10 or fewer offers one the previous 12 months is an exempt transaction under the limited offering exemption (a private placement)."
      },      
      {
        "question": "Is Transaction Exempt: The sale of unclaimed securities by sheriff of Santa Fe, New Mexico",
        "responses": [
          {"response": "Yes", correct: true},
          {"response": "No", correct: false},
        ],
        "reason": "Any transaction an executer, administrator, sheriff, marshal, receiver, trustee in bankruptcy, guardian, or convserator (but not a custodian for a minor under UTMA) is considered an exempt transaction under the Uniform Securities Act."
      },      
      {
        "question": "Is Transaction Exempt: Sale of stock of a private lately owned company to the public in an initial public offering",
        "responses": [
          {"response": "Yes", correct: false},
          {"response": "No", correct: true},
        ],
        "reason": "the sale of stock of a previously privately owned company to the public in an initial public offering is not an exempt transaction."
      },      
      {
        "question": "Which of the following are exempt transactions?<br><br>I. A nonissue transaction with a bank in a Nasdaq Capital Market Security<br>II. An unsolicited request from an existing client to purchase a nonexempt security<br>III. the sale of an unregistered security in a private, nonpublicly advertised transaction to 10 noninstitutional purchasers over a period not exceeding 12 months.<br>IV. The sale of unlisted securities by a trustee in bankruptcy",
        "responses": [
          {"response": "I and II", correct: false},
          {"response": "I, II, and III", correct: false},
          {"response": "I, II and IV", correct: true},
          {"response": "I, II, III, and IV", correct: false},
        ],
        "reason": "Choice III is not an exempt transaction because the private placement exemption is limited to 10 offerees, not 10 purchasers. The Administrator would be suspicious of anyone with 100% closing ratio. All of the others are included in our list of exempt transactions."
      },      
      {
        "question": "All of the following describe exempt transactions EXCEPT",
        "responses": [
          {"response": "ABC, a broker dealer, purchases securities from XYZ corporation as part of an underwriting commitment", correct: false},
          {"response": "First National Bank sells its entire publicly traded bond portfolio to Amalgamated National Bank", correct: false},
          {"response": "Amalgamated nation bank sells its publicly traded bond portfolio to ABC Insurance Company", correct: false},
          {"response": "Joe Smith, an employee of Amalgamated national Bank, buys securities from ABC Brokerage Corporation", correct: true},
        ],
        "reason": "the purchase of securities from a broker-dealer by an employee of a bank is a nonexempt transaction-it is a sale of a security by a broker-dealer to a member of the public and is there not exempt transaction between broker-dealers. and issuers as part of an underwriting commitment; transactions between banks; and transactions between banks and insurance companies are exempt because they are truncations between financial institutions. Exempt transactions are most often identified by who the transaction is with rather than what type of security is involved."
      },      
      {
        "question": "Under the USA, all of the following are exempt EXCEPT<br><br>I. U.S. Government securities<br>II. unsolicited transactions<br>III. transactions between issuers and underwriters<br>IV. securities fo federally chartered credit unions",
        "responses": [
          {"response": "I, II and IV", correct: false},
          {"response": "I and IV", correct: false},
          {"response": "II and III", correct: true},
          {"response": "IV only", correct: false},
        ],
        "reason": "Both unsolicited transaction and transactions between issuers and underwriters are exempt transaction, not exempt securities. U.S. government securities and securities of credit unions are exempt securities, not exempt transactions."
      },      
      {
        "question": "Under the rules of the Uniform Securities Act, an agent who sells shares of a Nasdaq Stock Market security to an insurance company has engaged in (a/an)",
        "responses": [
          {"response": "issuer transaction", correct: false},
          {"response": "unsuitable transaction", correct: false},
          {"response": "Unlawful transaction", correct: false},
          {"response": "sale exempt from the registration and advertising provisions fo the USA", correct: true},
        ],
        "reason": "An agent who sells any security to an insurance company is engaged in an exempt transaction that is not bound by the advertising and registration requirements of the USA. Any sale to certain institutional customers, such as banks, investment companies, and insurance companies is an exempt transaction. neither exempt securities nor exempt transaction must adhere to the registration and advertising provision of the USA. This is an exempt transaction because fo the nature of the purchaser, not the type of security being sold."
      },      
      {
        "question": "With regard to the registration requirement of the Uniform Securities Act, which of the following is NOT a correct statement?",
        "responses": [
          {"response": "Only the issuer itself can file a registration statement with the Administrator", correct: true},
          {"response": "An application for registration must indicate the amount of securities to be issued in the state.", correct: false},
          {"response": "the Administrator may require registrants to file quarterly reports.", correct: false},
          {"response": "the Administrator may require proceeds of an offer be placed into an escrow account until the issuer receives a specified amount for the sale of the security.", correct: false},
        ],
        "reason": "Registration statement may be filed by the issuer, any other person on whose behalf the offering is to be made, or a registered broker-dealer."
      },      
      {
        "question": "Unlawful/Lawful: An agent guarantees a client that funds invested in mutual funds made up of government securities cannot lose principal.",
        "responses": [
          {"response": "Unlawful", correct: true},
          {"response": "Lawful", correct: false},
        ],
        "reason": "It is unlawful to exercise discretion without prior written authorization. Because the client was non discretionary client, the agent could not, on is own initiative, select which internet company to invest in."
      },      
      {
        "question": "Unlawful/Lawful: An Agent receives a call from his client's spouse, advising him to sell her husband's securities. Her husband is out of the country and requested that his wife call the agent. The agent refuses because the wife does not have trading authorization, and she complains vigorously to his manager.",
        "responses": [
          {"response": "Unlawful", correct: false},
          {"response": "Lawful", correct: true},
        ],
        "reason": "An agent must refuse order form anyone other than the customer unless that person has prior written trading authority."
      },      
      {
        "question": "Unlawful/Lawful: A client writes a letter of complaint to his agent regarding securities that the agent had recommended. The agent calls the client to apologize and then disposes of the letter because the client seemed satisfied.",
        "responses": [
          {"response": "Unlawful", correct: true},
          {"response": "Lawful", correct: false},
        ],
        "reason": "All written customer complaints must be forwarded to a designated supervisor of the agent's employing broker-dealer."
      },      
      {
        "question": "Unlawful/Lawful: A registered agent borrows $10,000 from a credit union that is one of her best customers.",
        "responses": [
          {"response": "Unlawful", correct: false},
          {"response": "Lawful", correct: true},
        ],
        "reason": "Agents may borrow from clients who are banks or financial institutions that are in the business of lending money to public customers. Agents may not borrow money from customers who are not in the business of lending money."
      },      
      {
        "question": "Unlawful/Lawful: An agent is convicted that Internet Resources will rise significantly over the next 3 months. She offers to buy the stock back form her customers at 10% higher than its current price at any time during the next 3 months.",
        "responses": [
          {"response": "Unlawful", correct: true},
          {"response": "Lawful", correct: false},
        ],
        "reason": "An agent may not guarantee the performance of a security."
      },      
      {
        "question": "Unlawful/Lawful: An agent receives an order for the purchase of an observe foreign security. The agent informs the client that the commissions and charges on this purchase will be much higher than those of domestic securities.",
        "responses": [
          {"response": "Unlawful", correct: false},
          {"response": "Lawful", correct: true},
        ],
        "reason": "It is lawful to charge extra transaction fees when justified as long as the customer is informed before the transaction."
      },      
      {
        "question": "Unlawful/Lawful: An agent who works for a small broker-dealer that employs no securities analysts assures her clients that she can analyze any publicly traded security better than any analyst and that she will do it personally for each security purchased by a client, regardless of the industry.",
        "responses": [
          {"response": "Unlawful", correct: true},
          {"response": "Lawful", correct: false},
        ],
        "reason": "it is unlawful to promise services that an agent cannot reasonably expect to perform or that the agent is not qualified to perform."
      },      
      {
        "question": "Unlawful/Lawful: An agent recommends that her client buy 1,000 shares of Internet Consultants, Inc., and unregistered nonexempt security with a bright future.",
        "responses": [
          {"response": "Unlawful", correct: true},
          {"response": "Lawful", correct: false},
        ],
        "reason": "It is unlawful to solicit unregistered nonexempt securities."
      },      
      {
        "question": "Market manipulation is one of the prohibited practices under the uniform Securities Act. Which of the following is an example of a broker-dealer engaging in market manipulation?<br><br>I. Churning<br>II. Arbitrage<br>III. Wash trades<br>IV. Matched orders",
        "responses": [
          {"response": "I and II", correct: false},
          {"response": "I, III and IV", correct: false},
          {"response": "III and IV", correct: true},
          {"response": "IV only", correct: false},
        ],
        "reason": "A wash trades the practice of attempting to create the appearance of rating activity by entering offsetting buy and sell orders, is a form of market manipulation. Matched orders or matched Purchases occur when market participants agree to buy and sell securities Amon themselves to create the appearance of heightened market activity; this is also a form of market manipulation. Although churning is prohibited practice, it does not involve manipulation the market, and arbitrage is the perfectly legal practice of buying a security in one marketplace and simultaneously selling it in another to benefit from price disparity."
      },      
      {
        "question": "All fo the following are prohibited practices under the USA EXCEPT<br><br>I. borrowing money or securities form the account of a former banker with express written permission of the bank<br>II. failing to identify a customers financial objectives.<br>III. Selling rights instead of exercising them<br>IV. Supplying funds to a client's account only when or if it declines below a previously agreed-upon level",
        "responses": [
          {"response": "I and II", correct: false},
          {"response": "I, II, III", correct: false},
          {"response": "II and IV", correct: false},
          {"response": "III only", correct: true},
        ],
        "reason": "it is permissible to sell rights, which are securities. Borrowing money or securities from other than bank or broker-dealer in the business of lending, failing to identify a customer's financial objectives, and guaranteeing customers account against losses are all prohibited practices."
      },      
      {
        "question": "A customer is upset with her agent for not servicing her account properly and send him a complaint letter about his actions. Under the Uniform Securities Act, the agent should",
        "responses": [
          {"response": "Call the customer, apologize and attempt to correct the problem", correct: false},
          {"response": "tell the customer he is willing to make rescission", correct: false},
          {"response": "do nothing", correct: false},
          {"response": "bring the customer complaint to his employer immediately", correct: true},
        ],
        "reason": "Failure to bring customers' written complaints to the attention of the agent's broker-dealer is prohibited."
      },      
      {
        "question": "An agent hears a rumor concerning a security and uses the rumor to convince a client to purchase the security. Under the USA, the agent may",
        "responses": [
          {"response": "recommend the security if it is an appropriate investment", correct: false},
          {"response": "recommend the investment if the rumor is based on material inside information", correct: false},
          {"response": "recommend the security if the source of the rumor came form a reliable source", correct: false},
          {"response": "not recommend the security", correct: true},
        ],
        "reason": "the use of information, such as a rumor, that has no basis in fact is prohibited."
      },      
      {
        "question": "it is permitted under the USA for an individual licensed as an agent in the state to tell a client that",
        "responses": [
          {"response": "a registered security may lawfully be sold in that sate", correct: true},
          {"response": "an exempt security is not required to be registered because it is generally regarded as bing safer than a nonexempt security", correct: false},
          {"response": "her qualification have been found satisfactory by the Administrator", correct: false},
          {"response": "a registered security has been approved for sale in the state by Administrator", correct: false},
        ],
        "reason": "An agent may indicate that a security is registered or is exempt form registration. all fo the other statements are prohibited."
      },      
      {
        "question": "Which of the following is(are) prohibited under the USA?<br><br>I. Recommending tax shelters to low-income retirees<br>II. Stating that a state Administrator has approved an offering on the basis of quality of information found in the prospectus<br>III. Soliciting orders for unregistered, nonexempt securities<br>IV. Employing any device to defraud",
        "responses": [
          {"response": "I only", correct: false},
          {"response": "I and II", correct: false},
          {"response": "I, II and III", correct: false},
          {"response": "I, II, III and IV", correct: true},
        ],
        "reason": "Recommending tax shelters to low-income retirees is an example of an unsuitable transaction. Stating that an Administrator has approved an offering on the basis of the quality of information in the prospectus, soliciting orders for unregistered nonexempt securities, and employing a device to defraud are all prohibited practices under the USA."
      },      
      {
        "question": "A State's securities Administrator has jurisdiction over securities offering if it was",
        "responses": [
          {"response": "directed to residents fo that state", correct: false},
          {"response": "originated in that state", correct: false},
          {"response": "acceded in that state", correct: false},
          {"response": "All", correct: true},
        ],
        "reason": "The administrator has jurisdiction over a security offering if it was directed to, originated in, or was accepted in that state."
      },      
      {
        "question": "An Administrator has jurisdiction over an offer to sell securities if it is made in a newspaper published within the state with no more than",
        "responses": [
          {"response": "1/3 of its circulation outside the state", correct: false},
          {"response": "1/2 of its circulation outside the state", correct: false},
          {"response": "2/3 of its circulation outside the state", correct: true},
          {"response": "90% of its circulation outside the state", correct: false},
        ],
        "reason": "A state Administrator has jurisdiction over a securities offer made in a bona fide newspaper published within the state, but only whose circulation is not more than 2/3 outside the state."
      },      
      {
        "question": "What is the difference between an offer and a sale of a security?",
        "responses": [
          {"response": "An offer can be made only by a customer and a sale can be made only by a broker-dealer", correct: false},
          {"response": "An offer is a binding proposal to sell and a sale is a nonbinding proposal to sell", correct: false},
          {"response": "An offer is the attempt to sell and a sale is a binding contract to transfer a security for value", correct: true},
          {"response": "An offer must be approved by a designated supervisory person and a sale needs no such approval.", correct: false},
        ],
        "reason": "An offer is made in an attempt to sell; a sale is the binding contact to sell a security for value. An offer will not require prior approval, but a designated supervisory individual must approve all sales on the date the order is executed."
      },      
      {
        "question": "With regard to the powers of the Administrator, which of the following statements are NOT true?<br><br>I. The Administrator must seek an injunction to issue a cease and desist order.<br>II. the USA requires an Administrator to conduct a full hearing, public or private, before issuing a cease and desist order.<br>III. The USA grants the Administrator the power to issue injunctions to force complicate with the provisions of the act.",
        "responses": [
          {"response": "I and II", correct: false},
          {"response": "I and III", correct: false},
          {"response": "II and III", correct: false},
          {"response": "I, II and III", correct: true},
        ],
        "reason": "The Administrator need not seek an injunction to issue a cease and desist order. <br>The USA does not require that an Administrator conduct a public or private hearing before issuing a cease and deist order. When time does not permit, the Administrator may issue a cease and desist before a hearing to prevent a pending violation. The USA does not grant the Administrator the power to issue injections to force compliance with the act. The act permits the Administrator to issue cease and desist order, and, if they do not work, the Administrator may seek an injunction from a court of competent jurisdiction. A cease and desist order is an administrative order, whereas an injunction is a judicial order."
      },      
      {
        "question": "Although the Administrator has great power, the USA does place some limitations on the office. Which of the following statements regarding those powers are TRUE?<br>I. In conducting an investigation, an Administrator can compel the testimony of witnesses.<br>II. Investigations of serious violations must bar open to the public<br>III. An Administrator in Illinois may only enforce subpoenas form South Carolina if the violation originally occurred in Illinois.<br>IV. An Administrator may deny the registration of a securities professional who has been convicted of any felony within the past 10 years.",
        "responses": [
          {"response": "I, II and IV", correct: false},
          {"response": "I, III and IV", correct: false},
          {"response": "I and IV", correct: true},
          {"response": "II and III", correct: false},
        ],
        "reason": "An administrator may compel the testimony of witnesses when conduction an investigation. Investigation of serious violation need not be held in public. An Administrator in Illinois may enforce subpoenas from South Carolina whether or not eh violation occurred in Illinois. Conviction for any felony within the past 10 years is one of a number of reasons that the Administrator has for denying a license"
      },      
      {
        "question": "To protect the public, the Administrator may<br><br>I. deny a registration if the registrant does not have sufficient experience to function as an agent.<br>II. consider that an applicant for registration as an investment adviser is not necessarily qualified solely on the basis of experience as a broker-dealer or agent and, therefore, when he finds that an applicant for initial or renewal registration as a broker-dealer is not qualified as an investment adviser, he may by order condition that applicant's registration as broker-dealer upon his not transacting business in this state as an investment advisor<br>III. take into consideration that the registrant will work under the supervision of a registered investment adviser or broker-dealer in approving a registration<br>IV. deny a registration, although denial is not in the public's interest, if it is prudent in view of a change in the state's political composition",
        "responses": [
          {"response": "I and II", correct: false},
          {"response": "II and III", correct: true},
          {"response": "III and IV", correct: false},
          {"response": "I, II, III, and IV", correct: false},
        ],
        "reason": "The Administrator can deny, suspend or revoke a registration for many reasons, but they must be in the interest of the public. The administrator my not deny the registration simply because it is prudent. The administrator may determine that an applicant is not qualified to act as an adviser and thus limit the registration to that of a broker-dealer; the Administrator can also take into consideration whether the registrant will work under the supervision of a registered investment adviser or broker-dealer when approving an application. Lack of experience is insufficient for denial."
      },      
      {
        "question": "Under powers granted by the Uniform Securities Act, the Administrator my take all of the following actions EXCEPT",
        "responses": [
          {"response": "issue a cease and desist order against a broker-dealer", correct: false},
          {"response": "issue an arrest warrant for an investment adviser representative", correct: true},
          {"response": "refer evidence concerning violations fo this act to the attorney general or the proper district attorney who may then institute the appropriate criminal proceedings", correct: false},
          {"response": "file a civil complaint against an agent", correct: false},
        ],
        "reason": "An arrest warrant can only be issued by a court of law"
      },      
      {
        "question": "Which of the following statements relating to termination of registration is TRUE?",
        "responses": [
          {"response": "A registration, once in effect, may never be voluntarily withdrawn", correct: false},
          {"response": "An Administrator may not cancel a registration of a securities professional who is declared mental incompetent", correct: false},
          {"response": "An administrator may revoke the registration of a securities professional who is declared mentally incompetent", correct: false},
          {"response": "An Administrator my cancel the registration of a registrant no longer in business.", correct: true},
        ],
        "reason": "An administrator may cancel the registration of a registrant that is no longer in existence. A person may request a withdrawal of a registration. Withdrawals become effective after 30 days if there are no revocation or denial proceedings in process. An Administrator does not revoke the registration of a person who is declared mentally incompetent but instead cancels his registration; this is a nonpunitive administrative action."
      },      
      {
        "question": "Which of the following statements relating to penalties under the USA is TRUE?",
        "responses": [
          {"response": "Unknowing violation of the USA by an agent is cause for imprisonment under the criminal liability provisions of the act.", correct: false},
          {"response": "A purchaser of a security where an agent committed violation fo the USA may recover the original purchase price plus legal costs plus interest, less any income already received.", correct: true},
          {"response": "A seller who notices that a sale was made ink violation of the act may offer a right of rescission to the purchaser; this must be accepted within the sooner of two years after notice of the violation or three years after the sale.", correct: false},
          {"response": "Any person aggrieved by an order of the Administrator may request an appeal of the order within 15 days, which, in effect, functions as a stay of the order during the appeal period.", correct: false},
        ],
        "reason": "To be subject to time in prison, a sales agent must knowingly have violated the USA. A client who purchased a security in violation of the USA may recover the original purchase price plus costs involved in living a lawsuit. In addition, the purchaser is entitled to interest at a rate stated by the Administrator, less any earnings already received on the investment. The right of rescission must be accepted within 30 days of receipt of the letter of rescission. Although any person aggrieved by by an order of the Administrator may request an appeal fo the order witting 60 days, such appeal does not function as a stay order during the appeal process. The person who is the subject of the order must comply with the order during the period unless a stay is granted by the court."
      },      
      {
        "question": "When making an offer of a new issue that is in registration to a prospective client, an agent claims that his registration with the Administrator is proof of his qualifications. Under the USA",
        "responses": [
          {"response": "claiming his registration is approved by the Administrator while making an offer of a security undergoing registration subjects this agent to a civil liability", correct: false},
          {"response": "claiming his registration is approved by the Administrator while making an offer of a security does not subject his agent to a civil liability claim until the registration become effective", correct: false},
          {"response": "claiming his registration is approved by the Administrator subject this agent only to civil liability if a sale results", correct: true},
          {"response": "Regardless of whether a sale takes place, an agent making a misleading statement of this type subjects himself to possible civil liability", correct: false},
        ],
        "reason": "For an agent to have civil liability, a sale must take place. If the offer is made using a statement line the one in this question and a sale subsequently occurs, a client suffering a loss would be able to sue. Even though one may never claim approval by the Administrator, there is no civil liability unless the client has some kind of a claim. However, even through the client cannot bring a case, the Administrator could bring a disciplinary action against he agent for making this claim. On a law exam, you must be careful to understand who has a claim and when they do."
      },      
      {
        "question": "If convicted of a willful violation of the Uniform Securities Act, an agent is subject to",
        "responses": [
          {"response": "imprisonment for 5 years", correct: false},
          {"response": "A fine of $5,000 and/or imprisonment for 3 years", correct: true},
          {"response": "a fine of $10,000", correct: false},
          {"response": "disbarment", correct: false},
        ],
        "reason": "Under the USA, the maximum penalty is a fine of %5,000 and/or 3 years in jail."
      },      
      {
        "question": "The Administrator has authority to<br><br>I. issue a cease and desist order without a hearing<br>II. issue a cease and desist order only after a hearing<br>III. suspend an effective securities registration upon discovering an officer of the registrant has been convicted of a non securities related crime<br>IV. sentence violators fo the USA to 3 years in prison",
        "responses": [
          {"response": "I only", correct: true},
          {"response": "I and IV", correct: false},
          {"response": "II and III", correct: false},
          {"response": "II and IV", correct: false},
        ],
        "reason": "The Administrator may issue a cease and deist order without a hearing, but does not have the authority to convict violators fo the 1933 Securities Act in criminal prosecutions or sentence violators of the USA. The Administrator my suspend a security's effective registration upon subsequently discovering that an officer of the fir as been convicted of a securities-rleated crime, not a nonsecurities-related crime."
      },      
      {
        "question": "If a broker-dealer wishes to conduct operations on the premises of a financial institution, it is required to<br><br>I. disclose both in writing and orally to customers that the investments being sold are not FIDC insured, may lose value, and are not obligations of the financial institution<br>II. make a reasonable attempt to be in a location physically distinct form that where retail deposits are taken<br>III. attempt to obtain written acknowledgment form the customers that they have received and read the disclaimers<br>IV. be under common control with the institution",
        "responses": [
          {"response": "I and IV", correct: false},
          {"response": "I, II and III", correct: true},
          {"response": "II and III", correct: false},
          {"response": "I, II, III, and IV", correct: false},
        ],
        "reason": "It is a NASAA Model Rule that broker-dealers operation on the premises of a finical institution make certain disclosures. Every attempt should be made to locate separately from the banking operation and to obtain something in writing from the clients indicating that they have received the disclosures. It is not necessary that there be any relationship between the BD and the institution other than a business one."
      },      
      {
        "question": "An agent of a broker-dealer who willfully violates the Uniform Securities Act may be subject to which of the following?<br><br>I. Civil Liabilities<br>II. Criminal penalties<br>III Action taken by the Administrator to deny, suspend, or revoke the agent's registration",
        "responses": [
          {"response": "I only", correct: false},
          {"response": "I and II", correct: false},
          {"response": "II and III", correct: false},
          {"response": "I, II and III", correct: true},
        ],
        "reason": "Persons who are conceited of violating securities laws may find them selves subject to criminal penalties, civil liabilities, and suspension, denial, or revocation of registration"
      },      
      {
        "question": "Civil liability may arise under the Uniform Securities Act if an agent:<br>I. acting on behalf of an issuer fails to guarantee the safety of a new issue of debt securities rated BBB or higher.<br>II. uses an artifice or scheme that could reasonably be considered misleading in connection with a securities offering.<br>III. effects a sale of a nonexempt new issue of securities before filing a registration statement in that state.<br>IV. fails to disclose an immaterial fact.",
        "responses": [
          {"response": "I and II", correct: false},
          {"response": "I and III", correct: false},
          {"response": "II and IV", correct: false},
          {"response": "II and III", correct: true},
        ],
        "reason": "An agent who deliberately misleads or uses some artifice to deceive customers is in violation of the law. An agent selling a nonexempt security prior to registration in a state is also violating the law. Guaranteeing customers against loss is prohibited, and an agent who fails to guarantee is acting within the law and rules of the Uniform Securities Act. Failure to disclose an immaterial fact is acceptable. Failure to disclose a material fact is fraudulent."
      },      
      {
        "question": "While a student at college 9 years ago, Joe was convicted of possession of marijuana (a misdemeanor in that sate) and received a suspended sentence. Joe now resides in a different state where the same offense is a felony. If Joe disclosed the matter on his application to ABC Securities, Joe's registration may:",
        "responses": [
          {"response": "Be denied base on this conviction because the crime is a felony in the state where he seeks registration.", correct: false},
          {"response": "Be denied based on this conviction because it was less than 10 years ago.", correct: false},
          {"response": "not be needed base on this conviction cease it was a misdemeanor in the state where he went to college.", correct: true},
          {"response": "not be denied based on this conviction because it was 9 years ago.", correct: false},
        ],
        "reason": "In this context, only a conviction for a felony within the past 10 years may be grounds for denying a registration. Since the conviction does not show up on Joe's record as a felony, the fact that this state has different penalties for the same offense is irrelevant."
      },      
      {
        "question": "If an investor bought stock on one exchange and sold it at a higher price on another exchange, this practice constitutes a(n):",
        "responses": [
          {"response": "offense punishable by three years in a county jail.", correct: false},
          {"response": "violation under both the Uniform Securities Act and federal law.", correct: false},
          {"response": "violation of the Uniform Securities Act", correct: false},
          {"response": "perfectly acceptable market arbitrage.", correct: true},
        ],
        "reason": "This common practice is perfectly acceptable. Arbitrage is the practice of buying on one exchange and selling on another to take advantage of disparities."
      },      
      {
        "question": "Which of the following statements regarding civil liabilities under the Uniform Securities Act are TRUE?<br><br>I. In a fraudulent securities transaction, the customer is entitled to recover the amount of the transaction with interest at a rate set by the Administrator, less any income earned on the security plus attorney's fees.<br>II. Causes of action under the USA service the death of either plaintiff or defendant.<br>III. No suit may be initiated more than three years after the transaction or two years after the discovery of the violation, whichever occurs first.<br>IV. Rights and remedies in this act or in lieu of any others that exist under other laws.",
        "responses": [
          {"response": "I and II", correct: false},
          {"response": "III and IV", correct: false},
          {"response": "II, III and IV", correct: false},
          {"response": "I, II and III", correct: true},
        ],
        "reason": "The rights and remedies under the Uniform Securities Act exist in addition to any other rights and remedies that exist under other laws. Civil liabilities of the Uniform Securities Act allow for the revoker of the amount of the transaction with interest at a rate set by the administrator, less any income earned on the security plus attorney's fees. Every cause of action under this provision surveys the death of either plaintiff or defendant. No suit may be initiated more than three years after the transaction or two years after the discovery of the violation, whichever comes first."
      },      
      {
        "question": "Joan owns and operates a jewelry store, and she had contracted to purchase 5,000 Swiss watches, paying the watch manufacturer in Swiss francs 3 months from the date of contract. To protect (hedge) her currency risk, she purchases call options on Swiss francs. Which fo the following statements best describes her transaction in the Swiss franc calls in light of the USA?",
        "responses": [
          {"response": "She has not engaged in a securities transaction because options on foreign currencies are not considered to e securities under the USA.", correct: false},
          {"response": "She has engage in a securities transaction because options on foreign currencies are considered to be securities under the USA.", correct: true},
          {"response": "She has engaged in a prohibited transaction because American investors are generally prohibited form trading in foreign currencies under the USA", correct: false},
          {"response": "She has not engaged in a securities transaction because she purchased the options to hedge a business risk.", correct: false},
        ],
        "reason": ""
      },      
      {
        "question": "A registered investment adviser has been investigated by the Administrator for fraudulent misrepresentations purportedly made to several clients, if the IA is found to have been in violation of the Uniform Securities Act, this may result in:<br><br>I. a $10,000 fine per violation<br>II. a receiver being appointed over the adviser's assets<br>III. a prison term of 5 years per violation<br>IV. the requirement that the investment adviser make restitution to the victims",
        "responses": [
          {"response": "II and IV", correct: true},
          {"response": "III and IV", correct: false},
          {"response": "I and III", correct: false},
          {"response": "I and II", correct: false},
        ],
        "reason": ""
      },      
      {
        "question": "it would be considered a prohibited activity for an agent to engage in any of the following EXCEPT",
        "responses": [
          {"response": "sharing in profits of an account as a reward for the agent's recommendations exceeding the S&P 500.", correct: false},
          {"response": "failing to record exempt transaction on the broker-dealer's books and records.", correct: false},
          {"response": "executing a transaction in a nonexempt security in a discretionary account.", correct: true},
          {"response": "trading in the account of a conservative client exclusively in initial public offering with proper trading authorization from the client.", correct: false},
        ],
        "reason": ""
      },      
      {
        "question": "A customer has filed a complaint with the administrator that alleges churning in his account. When investigating the case, mitigating factors would include all of the following EXCEPT:",
        "responses": [
          {"response": "objectives of the client", correct: false},
          {"response": "account activity", correct: false},
          {"response": "the length of time the business relationship has existed", correct: true},
          {"response": "character of the account", correct: false},
        ],
        "reason": ""
      },      
      {
        "question": "Under the Uniform Securities Act, the definition of security includes a wide range of items. One of these is a two-party agreement representing a promise to repay a specific sum on a specified date that, if it meets certain requirements, is exempt form registration. This agreement is commonly referred to as a",
        "responses": [
          {"response": "promissory note", correct: true},
          {"response": "loan contract", correct: false},
          {"response": "debenture", correct: false},
          {"response": "futures contract", correct: false},
        ],
        "reason": ""
      },      
      {
        "question": "An agent's customer says that ABC Corporation is about to be bought out. The customer wishes to place an order to buy ABC common stock based upon this yet unreleased information, which he claims he learned form an officer in the company. How should the agent respond in this situation?",
        "responses": [
          {"response": "Discuss the matter with other, more experienced agents of the firm to evaluate the validity of the information.", correct: false},
          {"response": "Accept the customer's order and mark it solicited", correct: false},
          {"response": "Bring the information to the attention of the firms's supervisory principal named to handle such matters in the Supervisory Procedures Manual", correct: true},
          {"response": "bring the information to the attention of the State Securities Administrator", correct: false},
        ],
        "reason": ""
      },      
      {
        "question": "Under the Uniform Securities Act, which of the following is and example of churning?",
        "responses": [
          {"response": "following a practice of purchasing class A shares of a mutual fund for a client, holding them for no more than one month, and liquidating and using the processed to purchase Class A shares of another mutual fund offered by a different underwriter.", correct: true},
          {"response": "Frequent purchases one day and sales of the same stock the next day to make changes in a client's portfolio in order to align with customer's investment objectives.", correct: false},
          {"response": "A client engaging in day trading", correct: false},
          {"response": "bond swap", correct: false},
        ],
        "reason": ""
      },      
      {
        "question": "Under the USA, each of the following is specifically excluded form the definition of a broker-dealer EXCEPT AN:",
        "responses": [
          {"response": "issuer", correct: false},
          {"response": "investment adviser", correct: true},
          {"response": "agent", correct: false},
          {"response": "international bank", correct: false},
        ],
        "reason": ""
      },      
      {
        "question": "All fo the following are exempt securities under the Uniform Securities Act EXCEPT",
        "responses": [
          {"response": "securities issued by a Canadian province", correct: false},
          {"response": "securities issued by a bank holding company", correct: true},
          {"response": "securities issued by a federal savings and loan association", correct: false},
          {"response": "securities issued by the Canadian government", correct: false},
        ],
        "reason": ""
      },      
      {
        "question": "Under the Uniform Securities Act, the Administrator can require which of the following form broker-dealers and investment advisers?<br><br>I. Filing of sales literature<br>II. Maintaining of records<br>III. filing of financial statements<br>IV. Filing of amendments to registrations",
        "responses": [
          {"response": "II, III and IV", correct: false},
          {"response": "II and III", correct: false},
          {"response": "I and II", correct: false},
          {"response": "I, II, III and IV", correct: true},
        ],
        "reason": ""
      },      
      {
        "question": "Which of the following financial instruments is NOT considered a security",
        "responses": [
          {"response": "Ginnie Mae certificate", correct: false},
          {"response": "Home mortgage", correct: true},
          {"response": "Collateralized mortgage obligation (CMO)", correct: false},
          {"response": "Tradeable collateralized credit card trust certificate", correct: false},
        ],
        "reason": ""
      },      
    ]}
  ]},
  { "id": 2, "name": "Test 2", "chapters": [
    { "id": 3, "name": "Chapter 3", "questions": [
      {
        "question": "",
        "responses": [
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
        ],
        "reason": ""
      },      
    ]},
    { "id": 4, "name": "Chapter 4", "questions": [      {
      "question": "",
      "responses": [
        {"response": "", correct: false},
        {"response": "", correct: false},
        {"response": "", correct: false},
        {"response": "", correct: false},
      ],
      "reason": ""
    },      ]}
  ]},
  { "id": 3, "name": "Test 3", "chapters": [
    { "id": 5, "name": "Chapter 5", "questions": [
      {
        "question": "",
        "responses": [
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
        ],
        "reason": ""
      },      
    ]},
    { "id": 6, "name": "Chapter 6", "questions": [
      {
        "question": "",
        "responses": [
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
        ],
        "reason": ""
      },            
    ]},
    { "id": 7, "name": "Chapter 7", "questions": [
      {
        "question": "",
        "responses": [
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
        ],
        "reason": ""
      },      
    ]},
    { "id": 8, "name": "Chapter 8", "questions": [
      {
        "question": "",
        "responses": [
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
        ],
        "reason": ""
      },            
    ]},
    { "id": 9, "name": "Chapter 9", "questions": [
      {
        "question": "",
        "responses": [
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
        ],
        "reason": ""
      },            
    ]},
  ]},
  { "id": 4, "name": "Test 4", "chapters": [
    { "id": 10, "name": "Chapter 10", "questions": [
      {
        "question": "",
        "responses": [
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
        ],
        "reason": ""
      },            
    ]},
    { "id": 11, "name": "Chapter 11", "questions": [
      {
        "question": "",
        "responses": [
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
        ],
        "reason": ""
      },      
    ]},
    { "id": 12, "name": "Chapter 12", "questions": [
      {
        "question": "",
        "responses": [
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
        ],
        "reason": ""
      },      
    ]},
    { "id": 13, "name": "Chapter 13", "questions": [
      {
        "question": "",
        "responses": [
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
        ],
        "reason": ""
      },      
    ]}
  ]},
  { "id": 5, "name": "Test 5", "chapters": [
    { "id": 14, "name": "Chapter 14", "questions": [
      {
        "question": "",
        "responses": [
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
        ],
        "reason": ""
      },      
    ]},
    { "id": 15, "name": "Chapter 15", "questions": [
      {
        "question": "",
        "responses": [
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
        ],
        "reason": ""
      },      
    ]},
    { "id": 16, "name": "Chapter 16", "questions": [
      {
        "question": "",
        "responses": [
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
        ],
        "reason": ""
      },      
    ]},    
    { "id": 17, "name": "Chapter 17", "questions": [
      {
        "question": "",
        "responses": [
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
        ],
        "reason": ""
      },      
    ]}
  ]},
  { "id": 6, "name": "Test 6", "chapters": [
    { "id": 18, "name": "Chapter 18", "questions": [
      {
        "question": "",
        "responses": [
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
        ],
        "reason": ""
      },      
    ]},
    { "id": 19, "name": "Chapter 19", "questions": [
      {
        "question": "",
        "responses": [
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
        ],
        "reason": ""
      },      
    ]},
    { "id": 20, "name": "Chapter 20", "questions": [
      {
        "question": "",
        "responses": [
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
          {"response": "", correct: false},
        ],
        "reason": ""
      },            
    ]}
  ]}
];

// array in local storage for registered users
//let users = localStorage.getItem('users') || [];

// {
//   "question": "",
//   "responses": [
//     {"response": "", correct: false},
//     {"response": "", correct: false},
//     {"response": "", correct: true},
//     {"response": "", correct: false},
//   ],
//   "reason": ""
// },


@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
              case url.endsWith('api/questions/getTests') && method === 'GET':
                return getTests();

              case url.endsWith('api/questions/getChapters') && method === 'GET':
                console.log("handleRoute");
                console.log(request.params.get("testId"));
                const testId = request.params.get("testId");

                return getChapters(parseInt(testId));

              case url.endsWith('api/questions/getQuestions') && method === 'GET':
                return getQuestions();

            }
        }

        // route functions
        function getTests(){
          
          const testNames = tests.map( (test) => {return { id: test.id, name: test.name}; });
          return ok(testNames);

        }

        function getChapters(testId: number){
          const chapters = tests.find( (item) => { return item.id == testId; } )
          const chapterNames = chapters.chapters.map( (chapter) => { return {id: chapter.id, name: chapter.name}; })
          return ok(chapterNames);
        }

        function getQuestions(){
          return ok(tests);
        }

        ///////////////////
        // helper functions
        ///////////////////
        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'unauthorized' } });
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};