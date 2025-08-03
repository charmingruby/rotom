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

alias Rotom.Repo
alias Rotom.Accounts
alias Rotom.Accounts.User
alias Rotom.Chat
alias Rotom.Chat.{Message, Reply, Room, RoomMembership}

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
  |> Repo.get_by!(name: List.first(rooms) |> String.downcase())

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

users = Repo.all(User)

now = DateTime.utc_now() |> DateTime.truncate(:second)

room =
  Room
  |> Repo.get_by!(name: List.first(rooms) |> String.downcase())
  |> Repo.preload(:messages)

for message <- room.messages do
  num_replies = :rand.uniform(4) - 1

  if num_replies > 0 do
    for _ <- 0..num_replies do
      Repo.insert!(%Reply{
        user: Enum.random(users),
        message: message,
        body: "dummy body",
        inserted_at: DateTime.add(now, :rand.uniform(10), :minute)
      })
    end
  end
end
