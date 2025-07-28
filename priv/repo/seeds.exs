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
alias Rotom.Chat.{Message, Room, RoomMembership}

names = [
  "Sunny",
  "Chloe",
  "Alvin",
  "Slinky"
]

password = "dummypassword123"

for name <- names do
  email = (name |> String.downcase()) <> "@dummy.com"

  Accounts.register_user(%{
    username: name,
    email: email,
    password: password,
    password_confirmation: password
  })
end

sunny = Accounts.get_user_by_email("sunny@dummy.com")
chloe = Accounts.get_user_by_email("chloe@dummy.com")
alvin = Accounts.get_user_by_email("alvin@dummy.com")
slinky = Accounts.get_user_by_email("slinky@dummy.com")

users = [
  sunny,
  chloe,
  alvin,
  slinky
]

rooms = [
  "General",
  "Trade",
  "Discussion",
  "Advices",
  "Changelog"
]

Enum.with_index(rooms)
|> Enum.map(fn {room_name, idx} ->
  {:ok, room} =
    Chat.create_room(%{
      name: String.downcase(room_name),
      topic: String.capitalize(room_name) <> " topic"
    })

  for user <- users do
    if user != sunny or idx == 0 do
      Repo.insert!(%RoomMembership{
        room: room,
        user: user
      })
    end
  end
end)

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
