# Listmate (alpha, work in progress)

![Early listmate build](resources/header.png)

> **Next generation** knowledge suite for your music library, bookmarks, RSS feeds and [more](#supported-resource-types)

A web application to manage your personal library of different resources by connecting with and download data from external sources like Spotify, YouTube, and co.

<br>

## Features

- 📝 &nbsp; **Organize your [music library, your bookmarks, movies and more](#supported-resource-types)**
- ⚡️ &nbsp; Flexible data model – [**everything is a resource**](#everything-is-a-dataobject--resource)
- 🔗 &nbsp; **Link resources** to each other and to external services – [Spotify, YouTube, Pocket and more](#supported-apis)
- 🔊 &nbsp; **Built-in player** combines the playback of **local, Spotify and YouTube files** into a single interface
- 📻 &nbsp; **Unified player queue** – add videos and songs from different playback sources into a single joint queue
- 🤖 &nbsp; (Mostly[^1]) **works without JavaScript** – built with Remix and on top HTTP & HTML
- 💾 &nbsp; Keep all your data in a [single SQLite database file](https://sqlite.org/appfileformat.html)[^2]
- 🔌 &nbsp; **Direct integration** with [Spotify Data API and Playback SDK](https://developer.spotify.com/documentation/)
- 📆 &nbsp; **Scheduled data imports** – daily RSS feeds, weekly playlist updates...
- 💿 &nbsp; **Easy data exports** – JSON, XML, CSV, RDF exports and symlinked FS "views"

[^1]: Playback requires JS enabled
[^2]: As of right now, files are still in a seperate folder, but I plan on saving files as BLOB data inside the database as well.

<br>

---

<br>

## Concepts

### Everything is a DataObject / Resource

Every list item and associated data is represented as a `DataObject` in the database, and as a `Resource` in application logic.

_The reason for this separation is a `DataObject` is very much tied to database restrictions (and column types, as we use the Prisma ORM). On the other hand, a `Resource` doesn't care how the data is stored. This enables us to provide different database providers (like PostgreSQL) in the future, without having to change any application logic. Also, it is much easier to build custom typings for the different `ResourceType` types when that code is not auto-generated (as Prisma does)._

DataObjects can be linked together using a `ValueRef`. These **always** have a `.value` and may contain a `.ref`, which contains the `DataObject` ID to link to.
E.g. a `Song` resource has a `resource.values.artist` property, that is a ValueRef to a `Artist` resource.

Using this system makes it really easy to build resource types, that link to each other with automatic UI support.

<br>

![Resource explainer image](resources/remote-explainer.png)

<br>

### A DataObject can be linked to items on external services

For example a `Song` resource may have an equivalent in the Spotify database. To link them, a `DataObjectRemote` is created, that contains the `SourceType.SPOTIFY` and the respective `URI`.

By linking them, these two items become the logical "same".

A `DataObject` may contain multiple different `DataObjectRemote` entries.

<br>

### Lists can be created locally, or imported from external services

You can create lists locally, which can contain anything you want. You can also import lists from external services, but these can only contain types that the given API supports.

For example, you can import your Spotify playlists, and set the interval in which they should be synced.

**List content limitations:**

- Custom lists can contain any `ResourceType`
- Synced Spotify lists may only contain songs
  - Exception: Synced favourites (albums, artists, songs)
- Synced Pocket list may only contain bookmarks

_In the future, we may provide two-way syncing with selected providers, as not all of them provide appropiate APIs._

<br><br>

## Development

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

<br><br>

## Supported resource types

- Collection
- Song
- Album
- Artist
- Playlist [_Collection_]
- Bookmark
- Video
- Channel

###### Coming up

- Webpage
- RSS Feed [_Collection_]

## Supported APIs

- Spotify API
- YouTube API

###### Coming up

- Pocket API
- youtube-dl API
- Internet Archive API
- Archive API
