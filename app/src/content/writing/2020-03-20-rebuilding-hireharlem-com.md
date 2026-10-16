---
title: "Rebuilding hireharlem.com"
date: 2020-03-20
summary: "Hi! My name is Will! I’m a Software Engineer at IBM and I moved to San Francisco in September, 2018 for a new position at the IBM Garage. Before moving to SF, I was living in Raleigh, NC and…"
source: "https://medium.com/@willchavez/rebuilding-hireharlem-com-f07773edb7dc"
topics:
  - "Design"
  - "Code"
  - "Community"
  - "Harlem"
draft: false
deck: "How Alex Ocampo and I rebuilt hireharlem.com"
---

> [hireharlem.com](http://hireharlem.com) is a site that promotes businesses that are owned by **women**, **people of color**, **reinvest in the community**, and **long-time** residents. It spotlights these businesses with interviews and finds which business are close to you.

Hi! My name is Will! I’m a Software Engineer at IBM and I moved to San Francisco in September, 2018 for a new position at the IBM Garage. Before moving to SF, I was living in Raleigh, NC and trying to decide what my next move would be. A close friend and mentor of mine said something along the lines of “when are you gonna get another open opportunity to live on the west coast?” By some odd chance, that message really resonated with me and eventually I decided that I would move west to start my life in the Bay Area.

Moving to San Francisco from Raleigh was a huge transition for me. I sold my car and for the first time in my life I heavily relied on public transportation. Walking around downtown SF was always a trip. I’d see [robotic coffee makers](https://www.youtube.com/watch?v=TwMiZPoYDlc), [restaurants that have robots make your burgers](http://creator.rest/), tons and tons of tech advertisements (first time in my life seeing so many tech ads in a city), and every other building was renting out space to start-ups and companies I’d never heard of. Initially, I lived in SoMa and was paying criminal amounts of money for rent, but eventually came to my senses and moved to East Bay to find a better place that fit my budget.

I forget the exact time that I met [Alex](https://www.instagram.com/alexo.campo/), but we met because I was doing a tour of the [Watson Experience Center](https://localprojects.com/work/IBM-Watson), and he was our group’s facilitator. We resonated with each other and quickly became friends. You don’t meet that many LatinX people in the tech world so we definitely made it a priority to seek each other out and stay in touch.

The second time that we met up, he told me about a passion project he and his friends made called [hireharlem.com](http://hireharlem.com). It’s a website that promotes businesses that are owned by **women**, **people of color**, and **long-time** residents. It spotlights these businesses with close interviews and helps you find business close to you. The goal of Hire Harlem is to promote **conscious spending**, **reinvesting in your community**, and **giving business to those that share your values**.

The project was incepted in Harlem, NY and a lot of the businesses on the website are Harlem-based.

The goal is to support your local businesses and learn more about your community by having a common value that you share with the business owner. There was already a number of interviews and businesses on the website, but Alex had a plan to make the website increasingly robust and to scale it to include more cities. Naturally, this was something that I really wanted to be a part of.

By this time I was living in San Francisco for about 3 months, and while living in one of the most tech-centric cities in the world you experience strong moral contradictions and hypocrisy every day. There isn’t a day that we don’t see people suffering from lack of housing or businesses closing due to gentrification in the Bay Area. I’ve always felt some type of way about it and have a desire to do something for those in need.

Volunteering my time to work on a non-profit website who’s goal is to bring our community together, while at the same time practicing my skills was a perfect fit for me. I have no idea if a small website like this will work, but I know that it can be a start if we shift our focus to support and learn more about our community. We went to work immediately.

![Hire Harlem’s website showing local businesses on a neighborhood map](/uploads/medium/2020-03-20-rebuilding-hireharlem-com-02.webp)

*hireharlem before the site redesign*

We initially started by adding some new functionality to the site. The featured interviews were static [embedded javascript](https://ejs.co/) files that we kept having to recreate in order to add new interviews. So we set up a schema for interviews, imported all of our existing interviews into the database, and created CRUD endpoints to access it. This simple change gave us the ability to update our database and see more company interviews instead of having to create more EJS files and then push the change to elastic beanstalk.

While working on incremental updates to the site, Alex reached out to a local designer to see if she’d be interested in volunteering to do some work for the site. That’s when we met [Sasha](http://fletchux.design/), and she immediately tuned into the mission of HireHarlem. After showing us the work she had done for the redesign, both Alex and I were floored and we knew it would be a good opportunity to rebuild the site.

The tech stack for the older version of HH was primarily Node express, EJS, Mongoose, and standard HTML & CSS. Our new tech stack included using React, Redux, Style Components, Redux-Sagas, Material-UI, as well as a Node express server. Not much was entirely different from a language standpoint, it’s basically all javascript, but we had a loooot of views and API’s to recreate. Luckily, Sasha’s design work included a section on components that we could reuse throughout the website. 🙌🏽

![A design workspace with Hire Harlem page layouts](/uploads/medium/2020-03-20-rebuilding-hireharlem-com-03.webp)

*the awesome designs Sasha worked on*

For the first couple of meetings Alex and I went over the basic structure of a [create-react-app](https://github.com/facebook/create-react-app) project. We went through every single file in the project structure and went through any uncertainties. It was a good test for me and also helped me fill the gaps in my knowledge. By the end of the first meeting, we implemented half of the design of the landing page and we were both beyond hyped for this. Alex spent the time before our next meeting learning more about React and implementing components that he felt could be reused (buttons, icons, article sections). By the next meeting we were knocking out server-side api’s, learning redux, and making deliberate decisions towards completing our happy-path. I gave a small presentation on Redux and tried to lay out everything from my perspective.

![A screen recording of the Hire Harlem site redesign](/uploads/medium/2020-03-20-rebuilding-hireharlem-com-04.webp)

*late nights in SF listening to Herbie Hancock and building HH 👨🏽‍💻👨🏽‍💻*

When I think back on that time, it was such a great opportunity for me solidify my own understanding of frontend frameworks, and gave me a chance to teach others. It’s one thing to know and use a piece of tech, but to explain it and teach it new programmers helped me a lot too. My new position at the IBM Garage was also teaching me how to think outside of the box and learn to collaborate with others more efficiently. At my job I’m constantly collaborating with designers, architects, and product teams within IBM.

My previous position at Watson was wonderful as well, but I definitely feel that I didn’t have as much of clear picture as I do with business at the Garage. Seeing transparency in our business and gaining experience at the IBM Garage gave me a lot confidence, and helped me learn to believe in myself as a leader.

![An animated image from this story](/uploads/medium/2020-03-20-rebuilding-hireharlem-com-05.webp)

Alex wears many hats on this project: developer, project manager, platform engineer, and definitely took charge of our progress. One thing that I really loved about working with him is that he constantly reached out to me to ask me if I was doing**what I wanted to do**, and if I was accomplishing the technical goals **that I**wanted to achieve.

At the end of every one of our Sunday sessions, Alex asked me if there was something else I wanted to learn about or focus my attention on, whether it was learning about design, different frontend tech, or something completely off topic. Over the course of the year we’ve tried tons different things. From design thinking workshops to learning about marketing and brand building, to learning iOS development.

In my five years of being a developer, I had yet to meet someone like Alex who enabled me and pushed me to find what I’m passionate about, and work on getting close it my goals. His awareness of my goals was a constant reassurance to me and lead me to put the work in towards getting to the finish line.

![A walkthrough of Hire Harlem’s updated business directory](/uploads/medium/2020-03-20-rebuilding-hireharlem-com-06.webp)

*hireharlem.com now*

This is [hireharlem.com](http://hireharlem.com/) now. It took us a minute to get there but we got there. The site isn’t perfect, and we currently have about 59 issues in our our backlog 😅, but it’s a tremendous start. Our next couple of goals involve:

1. letting users log in to set their favorite places, and causes that they personally align with,
2. architecting our information to create a more scalable model for more cities (we currently only have companies in Harlem and Oakland),
3. adding more educational and historical information about the cities featured on hireharlem.com.

Throughout this experience I’ve met some talented and amazing people who have become close friends, and have gotten a chance to develop my skills all while working on a project that I really believe in! We’re constantly looking for more businesses to add to our site and people who’d like to work with us.

Follow us on [IG](https://www.instagram.com/hireharlem/) and stay tuned for more updates!
