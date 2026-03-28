export interface News {
  id: number;
  title: string;
  content: string;
  image_url: string;
  is_breaking: number;
  created_at: string;
}

export interface Video {
  id: number;
  title: string;
  youtube_url: string;
  created_at: string;
}

export interface Reporter {
  id: string;
  name: string;
  joining_date: string;
  validity: string;
  area: string;
  image_url?: string;
}
