using (SQLiteConnection conn = new SQLiteConnection(App.databaseLocation))
{
    conn.CreateTable<Post>();
    var posts = conn.Table<Post>().ToList();
}        