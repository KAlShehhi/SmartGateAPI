using (SQLiteConnection conn = new SQLiteConnection(App.databaseLocation))
{
    conn.CreateTable<Post>();
    var posts = conn.Table<Post>().ToList();
}        

using (SQLiteConnection conn = new SQLiteConnection(App.databaseLocation))
                    {
                        conn.CreateTable<User>();
                        User user = new User();
                        user.firstName = responseBodyJSON.firstName;
                        user.lastName = responseBodyJSON.lastName;
                        user.phoneNumber = responseBodyJSON.phoneNumber;
                        user.dateOfBirth = responseBodyJSON.dateOfBirth;
                        user.email = responseBodyJSON.email;
                        user.isMale = responseBodyJSON.isMale;
                        user.token = responseBodyJSON.token;
                        conn.Insert(user);
 
                    }


public async void CheckAndLogin(string email, string password)
{
    try
    {
        var httpClient = new HttpClient();
        var checkURL = "http://localhost:3000/api/app/users/checkPassword";
        var loginData = new
        {
            email = email,
        };
        string json = JsonConvert.SerializeObject(loginData);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        var response = await httpClient.PostAsync(checkURL, content);
        if (response.IsSuccessStatusCode)
        {
            var responseContent = await response.Content.ReadAsStringAsync();
            var responseJson = JsonConvert.DeserializeObject<passwordModel>(responseContent);
            string token = responseJson.token;
            if (BCrypt.CheckPassword(password, responseJson.password))
            {
                var loginURL = "http://localhost:3000/api/app/users/login";
                var res = new
                {
                    email = email,
                    token = token,
                    isAuthed = true
                };
                string resjson = JsonConvert.SerializeObject(res);
                var resContent = new StringContent(resjson, Encoding.UTF8, "application/json");
                var responseAuthed = await httpClient.PostAsync(loginURL, resContent);
                if (responseAuthed.IsSuccessStatusCode)
                {
                    var responseAuthedContent = await responseAuthed.Content.ReadAsStringAsync();
                    var responseAuthedJson = JsonConvert.DeserializeObject<LoggedInUserModel>(responseAuthedContent);
                    //TODO: Add storing user data to SQLite (data is stored in responseAuthedJson)

                    await Navigation.PushAsync(new HomePage());
                }
            }
            else
            {
                await DisplayAlert("Failed", "Invalid Email or Password", "Ok");
            }
        }
        else
        {
            await DisplayAlert("Failed", "Login Failed", "Ok");
        }
    }
    catch (Exception ex)
    {
        await DisplayAlert("Error", $"An error occurred: {ex.Message}", "OK");
    }
}
//Password model
        public string password { get; set; }
        public string token { get; set; }



         try
            {
          
                using (SQLiteConnection database = new SQLiteConnection(App.databaseLocation))
                {
                    database.CreateTable<User>();
                    if(database.GetTableInfo("User").Count > 0)
                    {
                        User user = database.Table<User>().FirstOrDefault();
                        var jwtHandler = new JwtSecurityTokenHandler();
                        var jwtToken = jwtHandler.ReadToken(user.token) as JwtSecurityToken;

                        if (jwtToken == null)
                            return false;

                        var utcNow = DateTime.UtcNow;
                        var expiry = jwtToken.ValidTo;

                        if (expiry != DateTime.MinValue && utcNow > expiry)
                            return false;

                        return true;
                    }
                    else
                    {
                        return false;
                    }

                }
                
            }
            catch (Exception ex)
            {
                // Handle exceptions accordingly
                Console.WriteLine($"Error validating JWT token: {ex.Message}");
                return false;
            }



            <ScrollView Grid.Row="1">
                 <StackLayout VerticalOptions="CenterAndExpand" Margin="45" >
                <Label x:Name="warning" IsVisible="false" Text="Please fill in all fields" TextColor="Red" HorizontalOptions="Center"/>
                <StackLayout Orientation="Horizontal" Margin="0,5">
                    <Entry x:Name="firstNameEntry" WidthRequest="165" Placeholder="First name"/>
                <Entry x:Name="lastNameEntry" WidthRequest="169" Placeholder="Last name"/>
                </StackLayout>
                <Entry x:Name="emailEntry" Placeholder="Email" Margin="0" Keyboard="Email"/>
                <StackLayout Orientation="Horizontal" Margin="0,5">
                    <Label Text="+971 " Margin="0, 10"/>
                <Entry x:Name="phonelEntry" Placeholder="Phone number" Keyboard="Numeric" WidthRequest="290"/>
                </StackLayout>
                <StackLayout Orientation="Horizontal" Margin="0,5">
                    <Label Text="Gender:" Margin="20,10"/>
                    <RadioButton x:Name="maleBtn" GroupName="gender" Value="Male" Content="Male" Padding="2" />
                    <RadioButton x:Name="femaleBtn" GroupName="gender" Value="Female" Content="Female" Padding="2"/>
                </StackLayout>
                <StackLayout Orientation="Horizontal" Margin="0, 5" HeightRequest="30">
                    <Image Source="calendar" Scale="0.8"/>
                    <DatePicker x:Name="dateEntry" WidthRequest="309"/>
                </StackLayout>
                <Label Text="Password must be:" TextColor="Gray" FontAttributes="Italic"/>
                <Label Text="  8 characters long" TextColor="Gray" FontAttributes="Italic"/>
                <Label Text="  Must contain a number and a captial letter" TextColor="Gray" FontAttributes="Italic"/>
                <Label Text="  Must contain a special character (!@_#)" TextColor="Gray" FontAttributes="Italic"/>
                <Entry x:Name="passwordEntry" Placeholder="Password" IsPassword="True" Margin="0, 5"/>
                <Entry x:Name="ConfirmPasswordEntry" Placeholder="Confirm Password" IsPassword="True" Margin="0, 5"/>
                <Picker x:Name="emirateEntry"  Title="Emirate" Margin="0, 5">
                    <Picker.Items>
                        <x:String>Abu Dhabi</x:String> 
                           <x:String>Dubai</x:String>
                           <x:String>Sharjah</x:String>
                           <x:String>Ajman</x:String>
                           <x:String>Umm Al Quawain </x:String>
                           <x:String>Ras Al Khaimah</x:String>
                           <x:String>Fujairah</x:String>
                    </Picker.Items>
                </Picker>
            <Button Text="Sign up" Style="{StaticResource normalButton}" Margin="0, 10" Clicked="signupButton_Clicked"/>
            <Button Text="I already have an account" Style="{StaticResource normalButton}" Clicked="Back_Clicked"/>
        </StackLayout>
            </ScrollView>