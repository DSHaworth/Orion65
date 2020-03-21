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