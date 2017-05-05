# Lyrical
An app for visualizing the popularity of words in lyrics over the past 50 years

## Data
The dataset was gathered by [walkerkq](https://github.com/walkerkq) and can be found in full [here](https://github.com/walkerkq/musiclyrics). Some work was done to prepare the data for counting the frequency of words in lyrics. First, the original csv file was converted to json. Then any punctuation was removed under the assumption that users do not want to consider differences in punctuation when inputting search terms.

The data is stored as an array of objects, each object holding the information a song. 

## Counting
The `WordCounter` class exposes a simple interface for counting words in the lyrics dataset. This object-oriented approach encourages loosely coupled code and convenient ways to implement caching. Only one `WordCounter` object is instantiated in a given session. A `WordCounter` instance holds a `cache` attribute, which it looks into every time before executing a count from scratch. Additionally, it holds a reference to the results of the last count made, and the targets of that count. This information now becomes easily accessible for rendering on the page.

It is common for 'ing' verbs to be written in song lyrics as verb + 'in'. For example, 'singing' will often be written as 'singin'. The word counter accomodates for this colloquialism by expanding the target of the count in the case of a verb ending in 'ing'. Other variables are taken into consideration, for example all words are downcased and punctuation is removed. The motivation is to make it as easy as possible for the user to make a meaningful query.

## Graph
The `WordCounter` generates an array of objects, each object holding a year and the data for that year (either an total count or percent). 

## Interface and Customization
