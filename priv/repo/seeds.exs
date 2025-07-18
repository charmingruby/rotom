# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Rotom.Repo.insert!(%Rotom.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

import Ecto.Query

alias Rotom.Repo
alias Rotom.Accounts
alias Rotom.Chat
alias Rotom.Chat.{Message, Room}

names = [
  "Sunny",
  "Chloe",
  "Alvin",
  "Slinky"
]

password = "dummypassword123"

for name <- names do
  email = (name |> String.downcase()) <> "@dummy.com"

  Accounts.register_user(%{email: email, password: password, password_confirmation: password})
end

sunny = Accounts.get_user_by_email("sunny@dummy.com")
chloe = Accounts.get_user_by_email("chloe@dummy.com")
alvin = Accounts.get_user_by_email("alvin@dummy.com")
slinky = Accounts.get_user_by_email("slinky@dummy.com")

rooms = [
  "General",
  "Trade",
  "Discussion",
  "Advices"
]

for room <- rooms do
  Chat.create_room(%{
    name: String.downcase(room),
    topic: String.capitalize(room) <> " topic"
  })
end

room =
  Room
  |> order_by([r], asc: r.inserted_at)
  |> limit(1)
  |> Repo.one()

for {user, message} <- [
      {
        alvin,
        "Dummy Alvin message"
      },
      {
        chloe,
        "Dummy Chloe message"
      },
      {
        slinky,
        "Dummy Slinky message"
      },
      {
        sunny,
        "Dummy Sunny message"
      }
    ] do
  Repo.insert(%Message{
    user: user,
    room: room,
    body: message
  })
end
